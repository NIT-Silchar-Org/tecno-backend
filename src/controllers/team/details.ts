import { RegistrationStatus } from "@prisma/client";

import { prisma } from "@utils/prisma";

import * as Interfaces from "@interfaces";
import * as Utils from "@utils";
import * as Errors from "@errors";

const getTeamDetails: Interfaces.Controller.Async = async (req, res, next) => {
  const { teamId: TID } = req.params;
  const teamId = parseInt(TID);

  const team = await prisma.team.findFirst({
    where: {
      id: teamId,
    },
    select: {
      teamName: true,
      registrationStatus: true,
      event: {
        select: {
          name: true,
          lat: true,
          lng: true,
          module: {
            select: {
              name: true,
            },
          },
          venue: true,
        },
      },
      members: {
        select: {
          user: {
            select: {
              email: true,
              username: true,
              imageUrl: true,
              collegeName: true,
            },
          },
          role: true,
          registrationStatus: true,
        },
      },
    },
  });

  if (!team) {
    return next(Errors.Team.teamNotFound);
  }

  return res.json(Utils.Response.Success(team));
};

/**
 *
 * @description sends all the teams and their details that are registered for that perticular event
 */

const getAllTeamsOfEvent: Interfaces.Controller.Async = async (
  req,
  res,
  next
) => {
  const { eventId: EID } = req.params;

  const eventId = parseInt(EID);

  if (isNaN(eventId)) {
    return next(Errors.Event.eventDoesntExist);
  }

  const teams = await prisma.team.findMany({
    where: {
      AND: [
        {
          eventId: eventId,
        },
        {
          registrationStatus: RegistrationStatus.REGISTERED,
        },
      ],
    },
    select: {
      members: {
        select: {
          user: {
            select: {
              id: true,
              firebaseId: true,
              collegeName: true,
              registrationId: true,
              email: true,
              imageUrl: true,
              username: true,
            },
          },
        },
      },
    },
  });

  return res.json(Utils.Response.Success(teams));
};

export { getTeamDetails, getAllTeamsOfEvent };
