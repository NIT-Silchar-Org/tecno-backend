import * as Interfaces from "@interfaces";
import { Event, User } from "@prisma/client";
import { prisma } from "@utils/prisma";
import * as Errors from "@errors";
import * as Utils from "@utils";

const updateEvent: Interfaces.Controller.Async = async (req, res, next) => {
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

  const { eventId: EID } = req.params;
  const eventId = Number.parseInt(EID);
  if (isNaN(Number.parseInt(eventId + "")) || typeof eventId !== "number")
    return next(Errors.Module.invalidInput);

  if (!(await prisma.event.findFirst({ where: { id: eventId } })))
    return next(Errors.Module.eventNotFound);
  if (moduleId) {
    if (isNaN(moduleId) || typeof moduleId !== "number")
      return next(Errors.Module.invalidInput);
    if (!(await prisma.module.findFirst({ where: { id: moduleId } })))
      return next(Errors.Module.moduleNotFound);
  }

  let regStart;
  if (registrationStartTime) regStart = new Date(registrationStartTime);
  let regEnd;
  if (registrationEndTime) regEnd = new Date(registrationEndTime);
  if (registrationStartTime && JSON.stringify(regStart) === "null")
    return next(Errors.Module.invalidInput);
  if (registrationEndTime && JSON.stringify(regEnd) === "null")
    return next(Errors.Module.invalidInput);

  const { organizers, managers }: { organizers: [User]; managers: [User] } =
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

  if (
    (registrationIncentive && !(typeof registrationIncentive === "number")) ||
    (attendanceIncentive && !(typeof attendanceIncentive === "number"))
  ) {
    return next(Errors.Module.invalidInput);
  }

  if (extraQuestions && !Array.isArray(extraQuestions)) {
    return next(Errors.Module.invalidInput);
  }

  if (
    (minTeamSize && typeof minTeamSize !== "number") ||
    (maxTeamSize && typeof maxTeamSize !== "number") ||
    (lat && typeof lat !== "string") ||
    (lng && typeof lng !== "string") ||
    (name && typeof name !== "string") ||
    (description && typeof description !== "string") ||
    (prizeDescription && typeof prizeDescription !== "string") ||
    (stagesDescription && typeof stagesDescription !== "string") ||
    (venue && typeof venue !== "string") ||
    (posterImage && typeof posterImage !== "string")
  )
    return next(Errors.Module.invalidInput);

  if (
    (typeof lat === "string" && !lat.length) ||
    (typeof lng === "string" && !lng.length) ||
    (typeof name === "string" && !name.length) ||
    (typeof description === "string" && !description.length) ||
    (typeof prizeDescription === "string" && !prizeDescription.length) ||
    (typeof stagesDescription === "string" && !stagesDescription.length) ||
    (typeof venue === "string" && !venue.length) ||
    (typeof posterImage === "string" && !posterImage.length)
  )
    return next(Errors.Module.invalidInput);

  const event = await prisma.event.update({
    where: { id: eventId },
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
      moduleId,
      organizers: {
        connect: organizersUsernames,
      },
      managers: {
        connect: managersUsernames,
      },
      extraQuestions: extraQuestions,
    },
  });

  if (!event) return next(Errors.System.serverError);
  return res.json(Utils.Response.Success(event));
};

export { updateEvent };
