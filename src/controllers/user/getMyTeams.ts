import * as Interfaces from "@interfaces";
import * as Success from "@success";
import { prisma } from "@utils/prisma";

const getMyTeams: Interfaces.Controller.Async = async (req, res) => {
  const { id } = req.user!;

  const teamRegistrations: Interfaces.User.getMyTeamsResponseTeamRegistration[] =
    await prisma.teamRegistration.findMany({
      where: {
        userId: id,
      },
      select: {
        id: true,
        role: true,
        registrationStatus: true,

        team: {
          select: {
            id: true,
            registrationStatus: true,
            teamName: true,
            extraInformation: true,
            members: {
              select: {
                id: true,
                registrationStatus: true,
                role: true,
                user: {
                  select: {
                    id: true,
                    username: true,
                    firstName: true,
                    middleName: true,
                    lastName: true,
                    imageUrl: true,
                  },
                },
              },
            },
            event: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

  res.json(Success.User.getMyTeamsResponse(teamRegistrations));
};

export { getMyTeams };
