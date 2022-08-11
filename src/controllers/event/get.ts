import * as Interfaces from "@interfaces";
import * as Errors from "@errors";
import { prisma } from "@utils/prisma";
import success from "@utils/response/success";

export const getAllEvents: Interfaces.Controller.Async = async (
  _req,
  res,
  next
) => {
  const events = await prisma.event.findMany();
  if (!events) return next(Errors.System.serverError);
  return res.json(success(events));
};

export const getEventsByModule: Interfaces.Controller.Async = async (
  req,
  res,
  next
) => {
  const { moduleId: MID } = req.params;
  const moduleId = Number.parseInt(MID);
  if (isNaN(moduleId)) return next(Errors.Module.invalidInput);

  let events = null;
  if (moduleId) events = await prisma.event.findMany({ where: { moduleId } });
  else events = await prisma.event.findMany();

  if (!events) return next(Errors.System.serverError);
  return res.json(success(events));
};

export const getEventInModuleById: Interfaces.Controller.Async = async (
  req,
  res,
  next
) => {
  const { eventId: EID, moduleId: MID } = req.params;
  const eventId = Number.parseInt(EID);
  const moduleId = Number.parseInt(MID);
  if (isNaN(eventId) || isNaN(moduleId))
    return next(Errors.Module.invalidInput);

  const event = await prisma.event.findFirst({
    where: { id: eventId, moduleId },
  });
  if (!event) return next(Errors.System.serverError);
  return res.json(success(event));
};
