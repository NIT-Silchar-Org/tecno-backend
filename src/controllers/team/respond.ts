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
  if (!(status in RegistrationStatus) || status === "PENDING") {
    return next(Errors.Team.invalidResponse);
  }

  // Check relation
  const team = await prisma.team.findFirst({
    where: {
      id: teamId,
      members: {
        some: {
          userId,
        },
      },
    },
    include: {
      members: {
        select: {
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

  // Get event details
  const event = await prisma.event.findFirst({
    where: {
      id: team.eventId,
    },
    select: {
      registrationIncentive: true,
      name: true,
      id: true,
    },
  });

  // Check registration status
  const registration = await prisma.teamRegistration.findFirst({
    where: {
      teamId,
      userId,
      registrationStatus: "PENDING",
    },
    take: 1,
  });

  if (!registration) {
    return next(Errors.Team.userRegistrationNotPending);
  }

  // Update Status
  if (status === "CANCELLED") {
    const userStatusUpdate = prisma.teamRegistration.update({
      where: {
        id: registration.id,
      },
      data: {
        registrationStatus: "CANCELLED",
      },
    });

    const teamStatusUpdate = prisma.team.update({
      where: {
        id: teamId,
      },
      data: {
        registrationStatus: "CANCELLED",
      },
    });

    await prisma.$transaction([userStatusUpdate, teamStatusUpdate]);
  } else {
    const countRegistered = await prisma.teamRegistration.count({
      where: {
        registrationStatus: "REGISTERED",
        teamId,
        userId: {
          not: userId,
        },
      },
    });

    const userStatusUpdate = prisma.teamRegistration.update({
      where: {
        id: registration.id,
      },
      data: {
        registrationStatus: "REGISTERED",
      },
    });

    if (countRegistered === team.members.length - 1) {
      const teamStatusUpdate = prisma.team.update({
        where: {
          id: teamId,
        },
        data: {
          registrationStatus: "REGISTERED",
        },
      });

      // Add registration trasaction here
      if (
        req.admin!.balance <
        event!.registrationIncentive * team.members.length
      ) {
        next(Errors.Transaction.insufficientBalance);
      }

      const transactions: Prisma.Prisma__TransactionClient<Transaction>[] = [];
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

      const adminUpdate = prisma.user.update({
        where: {
          firebaseId: req.admin!.firebaseId,
        },
        data: {
          balance:
            req.admin!.balance -
            event!.registrationIncentive * team.members.length,
        },
      });

      await prisma.$transaction([
        userStatusUpdate,
        teamStatusUpdate,
        adminUpdate,
        ...transactions,
        ...userUpdate,
      ]);
    } else {
      await prisma.$transaction([userStatusUpdate]);
    }
  }

  return res.json(Success.Team.userStatusUpdated);
};

export { teamRegistrationResponse };
