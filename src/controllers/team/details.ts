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
    },
  });

  if (!team) {
    return next(Errors.Team.teamNotFound);
  }

  return res.json(Utils.Response.Success(team));
};

export { getTeamDetails };
