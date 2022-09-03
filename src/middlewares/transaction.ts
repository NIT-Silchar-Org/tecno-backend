import * as Interfaces from "@interfaces";

import * as Errors from "@errors";
import { prisma } from "@utils/prisma";

const isUserEventManager: Interfaces.Middleware.Async = async (
  req,
  _res,
  next
) => {
  if (!req.user) {
    return next(Errors.Transaction.transactionUnauthenticated);
  }
  const { eventId } = req.body as Interfaces.Transaction.TransactionBody;

  const isManager = await prisma.event.count({
    where: {
      id: parseInt(eventId),
      managers: {
        some: {
          id: req.user!.id,
        },
      },
    },
  });

  if (!isManager) {
    return next(Errors.Transaction.transactionUnauthenticated);
  }

  return next();
};

export { isUserEventManager };
