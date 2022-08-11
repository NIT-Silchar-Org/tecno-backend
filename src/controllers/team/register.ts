import { prisma } from "@utils/prisma";
import { Prisma } from "@prisma/client";

import * as Interfaces from "@interfaces";
import * as Success from "@success";
import * as Errors from "@errors";
import * as Utils from "@utils";

const registerTeam: Interfaces.Controller.Async = async (req, res, next) => {
  const { eventId: EID } = req.params;
  const eventId = parseInt(EID);

  const { name, members } = req.body as Interfaces.Team.RegisterTeamBody;

  // Get event
  const event = await prisma.event.findFirst({
    where: {
      id: eventId,
    },
    select: {
      name: true,
      maxTeamSize: true,
      minTeamSize: true,
    },
  });

  // Check member limit
  if (
    event!.minTeamSize > members.length ||
    event!.maxTeamSize < members.length
  ) {
    return next(Errors.Team.teamSizeNotAllowed);
  }

  // Check team name
  const teamTaken = await prisma.team.count({
    where: {
      eventId,
      teamName: name,
      OR: [
        {
          registrationStatus: "REGISTERED",
        },
        {
          registrationStatus: "PENDING",
        },
      ],
    },
    take: 1,
  });

  if (teamTaken !== 0) {
    return next(Errors.Team.teamAlreadyExists);
  }

  // Check if users exist
  for await (const member of members) {
    const user = await prisma.user.count({
      where: { username: member.username },
      take: 1,
    });

    if (user === 0) {
      return next(Errors.User.userNotFound);
    }

    const belongsToTeam = await prisma.teamRegistration.count({
      where: {
        registrationStatus: "REGISTERED",
        user: {
          username: member.username,
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
      registrationStatus: "PENDING",
      role: member.role,
      user: {
        connect: {
          username: member.username,
        },
      },
    });
  });

  await prisma.team.create({
    data: {
      teamName: name,
      registrationStatus: "PENDING",
      event: {
        connect: {
          id: eventId,
        },
      },
      members: {
        create: memberRegistration,
      },
    },
  });

  // Send Emails to User
  for await (const member of members) {
    const user = await prisma.user.findFirst({
      where: {
        username: member.username,
      },
    });

    if (!user) {
      return next(Errors.User.userNotFound);
    }

    let html;
    let subject;
    if (member.role === "LEADER") {
      html = `
        <p>
          <h3>Dear <b>${user.name}</b>,</h3>
          Thank you for taking an interest in </b>${process.env.NAME}</b>'s
          </b>${event!.name}</b> event.

          <br>
          <br>

          Your team <b>${name}</b>'s registration application has been submitted successfully.
          All of your members now need to accept the invitation from their profile page
          for your team to be registered.
        </p>
      `;

      subject = `Team Registration Application Submitted | ${process.env.NAME}`;
    } else {
      html = `
        <p>
          <h3>Dear <b>${user.name}</b>,</h3>
          You've been invited to join the team <b>${name}</b> at
          </b>${process.env.NAME}</b>'s </b>${event!.name}</b> event.
          <br>
          You're requested to accept the invitation for the team to be
          one step closer to being fully registered for the event.
        </p>
      `;
      subject = `Team Invitation for ${name} | ${process.env.NAME}`;
    }

    Utils.Email.sendMail(user.email, html, subject); // meant to not use await
  }

  return res.json(Success.Team.teamCreated);
};

export { registerTeam };
