import * as Interfaces from "@interfaces";
import { Event } from "@prisma/client";
import { prisma } from "@utils/prisma";
import * as Errors from "@errors";
import * as Utils from "@utils";

const createEvent: Interfaces.Controller.Async = async (req, res, next) => {
  const {
    description,
    posterImage,
    attendanceIncentive,
    registrationIncentive,
    lat,
    lng,
    maxTeamSize,
    minTeamSize,
    moduleId,
    name,
    prizeDescription,
    registrationEndTime,
    registrationStartTime,
    stagesDescription,
    venue,
    extraQuestions,
  } = req.body as Event;
  // const { organisers, managers }: { organisers: [User]; managers: [User] } =
  //   req.body;
  if (
    !(
      description &&
      posterImage &&
      // incentive &&
      // isIncentivised &&
      lat &&
      lng &&
      maxTeamSize &&
      minTeamSize &&
      moduleId &&
      name &&
      prizeDescription &&
      registrationEndTime &&
      registrationStartTime &&
      stagesDescription &&
      venue
    )
  )
    return next(Errors.Module.invalidInput);

  if (extraQuestions && !Array.isArray(extraQuestions)) {
    return next(Errors.Module.invalidInput);
  }

  if (
    !(registrationIncentive && typeof registrationIncentive === "number") ||
    !(attendanceIncentive && typeof attendanceIncentive === "number")
  ) {
    return next(Errors.Module.invalidInput);
  }
  if (isNaN(Number.parseInt(moduleId + "")))
    return next(Errors.Module.invalidInput);
  if (
    typeof maxTeamSize !== "number" ||
    typeof minTeamSize !== "number" ||
    typeof lat !== "string" ||
    typeof lng !== "string" ||
    typeof name !== "string" ||
    typeof description !== "string" ||
    typeof prizeDescription !== "string" ||
    typeof stagesDescription !== "string" ||
    typeof venue !== "string" ||
    typeof posterImage !== "string"
  )
    return next(Errors.Module.invalidInput);

  const regStart = new Date(registrationStartTime);
  const regEnd = new Date(registrationEndTime);
  if (JSON.stringify(regStart) === "null" || JSON.stringify(regEnd) === "null")
    return next(Errors.Module.invalidInput);

  if (
    !(await prisma.module.findFirst({
      where: { id: moduleId },
    }))
  )
    return next(Errors.Module.moduleNotFound);

  const { organizers, managers }: { organizers: [string]; managers: [string] } =
    req.body;

  let organizersUsernames;
  if (organizers) {
    organizersUsernames = await Utils.Event.extractUsername(organizers);
    if (!organizersUsernames) return next(Errors.User.userNotFound);
  }
  let managersUsernames;
  if (managers) {
    managersUsernames = await Utils.Event.extractUsername(managers);
    if (!managersUsernames) return next(Errors.User.userNotFound);
  }

  const event = await prisma.event.create({
    data: {
      description,
      posterImage,
      attendanceIncentive,
      registrationIncentive,
      lat,
      lng,
      maxTeamSize,
      minTeamSize,
      name,
      prizeDescription,
      registrationEndTime: regEnd,
      registrationStartTime: regStart,
      stagesDescription,
      venue,
      module: {
        connect: { id: moduleId },
      },
      organizers: {
        connect: organizersUsernames,
      },
      managers: {
        connect: managersUsernames,
      },
    },
  });

  if (!event) return next(Errors.System.serverError);
  return res.json(Utils.Response.Success(event));
};

export { createEvent };
