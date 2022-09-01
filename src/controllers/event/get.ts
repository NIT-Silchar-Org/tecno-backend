import * as Interfaces from "@interfaces";
import * as Errors from "@errors";
import { prisma } from "@utils/prisma";
import success from "@utils/response/success";
import * as Utils from "@utils";

export const getAllEvents: Interfaces.Controller.Async = async (
  _req,
  res,
  next
) => {
  const events = await prisma.event.findMany();
  if (!events) return next(Errors.System.serverError);
  return res.json(Utils.Response.Success(events));
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

export const getEventById: Interfaces.Controller.Async = async (
  req,
  res,
  next
) => {
  const { eventId: EID } = req.params;
  const eventId = Number.parseInt(EID);

  if (isNaN(eventId)) return next(Errors.Module.invalidInput);

  const event = await prisma.event.findFirst({
    where: { id: eventId },
  });
  if (!event) return next(Errors.Module.eventNotFound);
  return res.json(Utils.Response.Success(event));
};

export const getAllEventsNested: Interfaces.Controller.Async = async (
  _req,
  res,
  next
) => {
  const module = await prisma.module.findMany({
    include: {
      events: true,
    },
  });
  if (!module) return next(Errors.Module.moduleNotFound);
  return res.json(Utils.Response.Success(module));
};
