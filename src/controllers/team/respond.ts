import { prisma } from "@utils/prisma";
import { RegistrationStatus } from "@prisma/client";

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

  // Find Team for user in event
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
        },
      },
    },
  });

  if (!team) {
    return next(Errors.Team.userNotPartOfTeam);
  }

  // Check cancellation status of Team
  if (team.registrationStatus === "CANCELLED") {
    return next(Errors.Team.teamRegistrationCancelled);
  }

  // Check if already responded
  const indexOfMember = team.members.findIndex(
    (member) => member.userId === userId
  );

  if (team.members[indexOfMember].registrationStatus !== "PENDING") {
    return next(Errors.Team.userAlreadyResponded);
  }

  // Check if status is registered in another team in the event
  const otherTeam = await prisma.team.findFirst({
    where: {
      members: {
        some: {
          userId,
          registrationStatus: "REGISTERED",
        },
      },
    },
  });

  if (otherTeam) {
    return next(Errors.Team.userAlreadyRegistered);
  }

  // Update Status
  if (status === "CANCELLED") {
    // Cancel Team Registration
    await prisma.team.update({
      where: {
        id: teamId,
      },
      data: {
        registrationStatus: "CANCELLED",
        members: {
          updateMany: {
            where: {
              teamId,
            },
            data: {
              registrationStatus: "CANCELLED",
            },
          },
        },
      },
    });
  } else if (status === "REGISTERED") {
    // Update team and member status.
    // Complete it in a single transaction.

    await prisma.$transaction(async (prisma) => {
      // Update Member's Status to Registered
      await prisma.team.update({
        where: {
          id: teamId,
        },
        data: {
          members: {
            update: {
              where: {
                id: userId,
              },
              data: {
                registrationStatus: "REGISTERED",
              },
            },
          },
        },
      });

      // Check if all other members have registered
      let allMembersRegistered = true;

      team.members.forEach((member) => {
        if (member.userId !== userId) {
          allMembersRegistered &&= member.registrationStatus === "REGISTERED";
        }
      });

      if (allMembersRegistered) {
        // Update Team Status
        await prisma.team.update({
          where: {
            id: teamId,
          },
          data: {
            registrationStatus: "REGISTERED",
          },
        });
      }
    });
  }

  return res.json(Success.Team.userStatusUpdated);
};

export { teamRegistrationResponse };
