import * as Interfaces from "@interfaces";

import * as Errors from "@errors";
import { prisma } from "@utils/prisma";

const isEventValid: Interfaces.Middleware.Async = async (req, _res, next) => {
  const { eventId: EID } = req.params;
  const eventId = parseInt(EID);
  if (isNaN(eventId)) {
    return next(Errors.Event.eventDoesntExist);
  }

  const event = await prisma.event.findFirst({
    where: {
      id: eventId,
    },
  });

  if (!event) {
    return next(Errors.Event.eventDoesntExist);
  }

  return next();
};

export { isEventValid };
