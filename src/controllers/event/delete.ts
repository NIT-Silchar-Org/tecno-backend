import * as Interfaces from "@interfaces";
import * as Errors from "@errors";
import { prisma } from "@utils/prisma";
import * as Utils from "@utils";

export const deleteEvent: Interfaces.Controller.Async = async (
  req,
  res,
  next
) => {
  const { eventId: EID } = req.params;
  const eventId = Number.parseInt(EID);
  if (isNaN(eventId)) return next(Errors.Module.invalidInput);
  const { moduleId: MID } = req.params;
  const moduleId = Number.parseInt(MID);
  if (isNaN(moduleId)) return next(Errors.Module.invalidInput);

  if (!(await prisma.event.findFirst({ where: { id: eventId, moduleId } })))
    return next(Errors.Module.eventNotFound);

  const event = await prisma.event.delete({ where: { id: eventId } });
  if (!event) return next(Errors.System.serverError);
  return res.json(Utils.Response.Success(event));
};
