import * as Interfaces from "@interfaces";
import { Event } from "@prisma/client";
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

  if (!!incentive !== !!isIncentivised) return next(Errors.Module.invalidInput);

  if (
    !(await prisma.module.findFirst({
      where: { id: moduleId },
    }))
  )
    return next(Errors.Module.moduleNotFound);

  const event = await prisma.event.create({
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
      registrationEndTime: new Date(registrationEndTime),
      registrationStartTime: new Date(registrationStartTime),
      stagesDescription,
      venue,
      module: {
        connect: { id: moduleId },
      },
    },
  });

  if (!event) return next(Errors.System.serverError);
  return res.json(Utils.Response.Success(event));
};
