import { prisma } from "@utils/prisma";
import { Prisma, RegistrationStatus, TeamMemberRole } from "@prisma/client";

import * as Interfaces from "@interfaces";
import * as Success from "@success";
import * as Errors from "@errors";
// import * as Utils from "@utils";

const registerTeam: Interfaces.Controller.Async = async (req, res, next) => {
  const { eventId: EID } = req.params;
  const eventId = parseInt(EID);
  const {
    name,
    members: memberArray,
    extraInformation,
  } = req.body as Interfaces.Team.RegisterTeamBody;

  memberArray.push(req.user!.username);

  const members = new Set(memberArray);
  // Any duplicate members, including leader,
  // if duplicate is present, gets removed.

  if (members.size !== memberArray.length) {
    return next(Errors.Team.memberDuplicates);
  }

  // Get event
  const event = await prisma.event.findFirst({
    where: {
      id: eventId,
    },
    select: {
      name: true,
      maxTeamSize: true,
      minTeamSize: true,
      registrationStartTime: true,
      registrationEndTime: true,
      moduleId: true,
    },
  });

  // const module = await prisma.module.findFirst({
  //   where: {
  //     id: event?.moduleId,
  //   },
  //   select: {
  //     name: true,
  //   },
  // });

  // Check time
  // const now = new Date();
  // if (now < event!.registrationStartTime || now > event!.registrationEndTime) {
  //   return next(Errors.Team.timeNotRight);
  // }

  if (!event) {
    return next(Errors.Event.eventDoesntExist);
  }

  // Check member limit
  if (event!.minTeamSize > members.size || event!.maxTeamSize < members.size) {
    return next(Errors.Team.teamSizeNotAllowed);
  }

  // Check team name
  const teamTaken = await prisma.team.count({
    where: {
      eventId,
      teamName: name,
      OR: [
        {
          registrationStatus: RegistrationStatus.REGISTERED,
        },
        {
          registrationStatus: RegistrationStatus.PENDING,
        },
      ],
    },
    take: 1,
  });

  if (teamTaken !== 0) {
    return next(Errors.Team.teamAlreadyExists);
  }

  // Check if users exist and if registered in another team.
  for await (const member of members) {
    const user = await prisma.user.count({
      where: { username: member },
      take: 1,
    });

    if (user === 0) {
      return next(Errors.User.userNotFound);
    }

    const belongsToTeam = await prisma.teamRegistration.count({
      where: {
        registrationStatus: RegistrationStatus.REGISTERED,
        user: {
          username: member,
        },
        team: {
          event: {
            id: eventId,
          },
        },
      },
      take: 1,
    });

    if (belongsToTeam !== 0) {
      return next(Errors.Team.userAlreadyRegistered);
    }
  }

  // Creating a connection array after modifying data from front-end
  const memberRegistration: Prisma.TeamRegistrationCreateWithoutTeamInput[] =
    [];

  members.forEach((member) => {
    memberRegistration.push({
      registrationStatus:
        member === req.user!.username
          ? RegistrationStatus.REGISTERED
          : RegistrationStatus.PENDING,
      role:
        member === req.user!.username
          ? TeamMemberRole.LEADER
          : TeamMemberRole.MEMBER,
      user: {
        connect: {
          username: member,
        },
      },
    });
  });

  await prisma.team.create({
    data: {
      teamName: name,
      registrationStatus:
        members.size === 1
          ? RegistrationStatus.REGISTERED
          : RegistrationStatus.PENDING,
      event: {
        connect: {
          id: eventId,
        },
      },
      members: {
        create: memberRegistration,
      },
      extraInformation: extraInformation,
    },
  });

  // Send Emails to User
  for await (const member of members) {
    const user = await prisma.user.findFirst({
      where: {
        username: member,
      },
    });

    if (!user) {
      return next(Errors.User.userNotFound);
    }

    // let html;
    // let subject;
    // if (member === req.user!.username) {
    //   html = Utils.HTML.createRegisterCreationHTML({
    //     eventName: event.name,
    //     leaderName: user.firstName,
    //     moduleName: module!.name,
    //     teamName: name,
    //   });

    //   subject = `Team Registration Application Submitted | ${process.env.NAME}`;
    // } else {
    //   html = Utils.HTML.createRegisterInvitationHTML({
    //     eventName: event.name,
    //     leaderName: user.firstName,
    //     moduleName: module!.name,
    //   });
    //   subject = `Team Invitation for ${name} | ${process.env.NAME}`;
    // }

    // Utils.Email.sendMail(user.email, html, subject); // Await Avoided On Purpose
  }

  return res.json(Success.Team.teamCreated);
};

export { registerTeam };
