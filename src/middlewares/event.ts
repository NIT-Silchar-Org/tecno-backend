import * as Interfaces from "@interfaces";

import * as Errors from "@errors";
import { prisma } from "@utils/prisma";

const isEventExist: Interfaces.Middleware.Async = async (req, _res, next) => {
  const { eventId } = req.body as Interfaces.Transaction.TransactionBody;

  const event = await prisma.event.findFirst({
    where: { id: parseInt(eventId) },
  });

  if (!event) {
    return next(Errors.Event.eventDoesntExist);
  }

  return next();
};

export { isEventExist };
