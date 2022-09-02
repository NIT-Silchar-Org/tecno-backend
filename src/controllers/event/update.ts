import * as Interfaces from "@interfaces";
import { Event, User } from "@prisma/client";
import { prisma } from "@utils/prisma";
import * as Errors from "@errors";
import * as Utils from "@utils";

export const updateEvent: Interfaces.Controller.Async = async (
  req,
  res,
  next
) => {
  console.log("hi");
  const {
    description,
    posterImage,
    incentive,
    isIncentivised,
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
  } = req.body as Event;

  const { eventId: EID } = req.params;
  const eventId = Number.parseInt(EID);
  if (isNaN(eventId)) return next(Errors.Module.invalidInput);

  if (!(await prisma.event.findFirst({ where: { id: eventId } })))
    return next(Errors.Module.eventNotFound);

  const { organisers, managers }: { organisers: [User]; managers: [User] } =
    req.body;

  const event = await prisma.event.update({
    where: { id: eventId },
    data: {
      description,
      posterImage,
      incentive,
      isIncentivised,
      lat,
      lng,
      maxTeamSize,
      minTeamSize,
      name,
      prizeDescription,
      registrationEndTime,
      registrationStartTime,
      stagesDescription,
      venue,
      module: {
        connect: {
          id: moduleId,
        },
      },
      organizers: {
        connect: Utils.Event.extractUsername(organisers),
      },
      managers: {
        connect: Utils.Event.extractUsername(managers),
      },
    },
  });

  if (!event) return next(Errors.System.serverError);
  return res.json(Utils.Response.Success(event));
};
