import * as Interfaces from "@interfaces";
import { Event, User } from "@prisma/client";
import { prisma } from "@utils/prisma";
import * as Errors from "@errors";
import * as Utils from "@utils";

export const createEvent: Interfaces.Controller.Async = async (
  req,
  res,
  next
) => {
  const {
    description,
    image,
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
  const { organisers, managers }: { organisers: [User]; managers: [User] } =
    req.body;
  if (
    !(
      description &&
      image &&
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
      venue &&
      organisers &&
      managers
    )
  )
    return next(Errors.Module.invalidInput);

  if (!!incentive !== !!isIncentivised) return next(Errors.Module.invalidInput);

  if (!(await prisma.module.findFirst()))
    return next(Errors.Module.moduleNotFound);

  const event = await prisma.event.create({
    data: {
      description,
      image,
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
        connect: { id: moduleId },
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
