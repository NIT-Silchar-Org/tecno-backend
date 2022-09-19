import { prisma } from "@utils/prisma";
import {
  Prisma,
  RegistrationStatus,
  Transaction,
  TransactionReason,
  User,
} from "@prisma/client";

import * as Interfaces from "@interfaces";
import * as Errors from "@errors";
import * as Success from "@success";

const teamRegistrationResponse: Interfaces.Controller.Async = async (
  req,
  res,
  next
) => {
  const { teamId: TID } = req.params;
  const teamId = parseInt(TID);

  const userId = req.user!.id;

  const { status } = req.body as Interfaces.Team.RegistrationResponse;

  // Check response
  if (
    !(status in RegistrationStatus) ||
    status === RegistrationStatus.PENDING
  ) {
    return next(Errors.Team.invalidResponse);
  }

  // Find Team for user in event
  const team = await prisma.team.findFirst({
    where: {
      id: teamId,
      members: {
        some: {
          user: {
            id: userId,
          },
        },
      },
    },
    include: {
      members: {
        select: {
          id: true,
          userId: true,
          registrationStatus: true,
          role: true,
          user: {
            select: {
              firebaseId: true,
              balance: true,
            },
          },
        },
      },
    },
  });

  if (!team) {
    return next(Errors.Team.userNotPartOfTeam);
  }

  // Check cancellation status of Team
  if (team.registrationStatus === RegistrationStatus.CANCELLED) {
    return next(Errors.Team.teamRegistrationCancelled);
  }

  // Check if already responded
  const indexOfMember = team.members.findIndex(
    (member) => member.userId === userId
  );

  if (
    team.members[indexOfMember].registrationStatus !==
    RegistrationStatus.PENDING
  ) {
    return next(Errors.Team.userAlreadyResponded);
  }

  const event = await prisma.event.findFirst({
    where: {
      id: team.eventId,
    },
  });

  // Check if status is registered in another team in the event
  const otherTeam = await prisma.team.findFirst({
    where: {
      eventId: team.eventId,
      members: {
        some: {
          userId,
          registrationStatus: RegistrationStatus.REGISTERED,
        },
      },
    },
  });

  if (otherTeam) {
    return next(Errors.Team.userAlreadyRegistered);
  }

  // Update Status
  if (status === RegistrationStatus.CANCELLED) {
    // Cancel Team Registration
    await prisma.team.update({
      where: {
        id: team.id,
      },
      data: {
        registrationStatus: RegistrationStatus.CANCELLED,
        members: {
          updateMany: {
            where: {
              teamId,
            },
            data: {
              registrationStatus: RegistrationStatus.CANCELLED,
            },
          },
        },
      },
    });
  } else if (status === RegistrationStatus.REGISTERED) {
    // Update team and member status.
    // Complete it in a single transaction.

    await prisma.$transaction(async (prisma) => {
      // Update Member's Status to Registered
      const memberRegistration = await prisma.teamRegistration.findFirst({
        where: {
          userId,
        },
      });

      await prisma.team.update({
        where: {
          id: team.id,
        },
        data: {
          members: {
            update: {
              where: {
                id: memberRegistration!.id,
              },
              data: {
                registrationStatus: RegistrationStatus.REGISTERED,
              },
            },
          },
        },
      });

      // Check if all other members have registered
      let allMembersRegistered = true;

      team.members.forEach((member) => {
        if (member.userId !== userId) {
          allMembersRegistered &&=
            member.registrationStatus === RegistrationStatus.REGISTERED;
        }
      });

      if (allMembersRegistered) {
        // Update Team Status
        await prisma.team.update({
          where: {
            id: teamId,
          },
          data: {
            registrationStatus: RegistrationStatus.REGISTERED,
          },
        });

        // Add registration trasaction here
        if (
          req.admin!.balance <
          event!.registrationIncentive * team.members.length
        ) {
          next(Errors.Transaction.insufficientBalance);
        }

        const transactions: Prisma.Prisma__TransactionClient<Transaction>[] =
          [];
        const userUpdate: Prisma.Prisma__UserClient<User>[] = [];

        team.members.forEach((member) => {
          transactions.push(
            prisma.transaction.create({
              data: {
                amount: event!.registrationIncentive,
                reason: TransactionReason.REGISTRATION,
                event: {
                  connect: {
                    id: event!.id,
                  },
                },
                from: {
                  connect: {
                    firebaseId: req.admin!.firebaseId,
                  },
                },
                to: {
                  connect: {
                    firebaseId: member.user.firebaseId,
                  },
                },
              },
            })
          );
          userUpdate.push(
            prisma.user.update({
              where: {
                id: member.userId,
              },
              data: {
                balance: member.user.balance + event!.registrationIncentive,
              },
            })
          );
        });

        await Promise.all(transactions);
        await Promise.all(userUpdate);

        await prisma.user.update({
          where: {
            firebaseId: req.admin!.firebaseId,
          },
          data: {
            balance:
              req.admin!.balance -
              event!.registrationIncentive * team.members.length,
          },
        });
      }
    });
  }

  return res.json(Success.Team.userStatusUpdated);
};

export { teamRegistrationResponse };
