import * as Interfaces from "@interfaces";
import { Event } from "@prisma/client";
import { prisma } from "@utils/prisma";
import success from "@utils/response/success";
import * as Errors from "@errors";

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
      venue
    )
  )
    return next(Errors.Module.invalidInput);

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
    },
  });

  if (!event) return next(Errors.System.serverError);
  return res.json(success(event));
};
