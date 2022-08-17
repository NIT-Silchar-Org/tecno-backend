import * as Interfaces from "@interfaces";

import * as Errors from "@errors";
import { prisma } from "@utils/prisma";

const isSenderManager: Interfaces.Middleware.Async = async (
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
        every: {
          id: req.user.id,
        },
      },
    },
  });

  if (!isManager) {
    return next(Errors.Transaction.transactionUnauthenticated);
  }

  return next();
};

const isReceiverAdmin: Interfaces.Middleware.Async = async (
  req,
  _res,
  next
) => {
  const { toAdminId } =
    req.body as Interfaces.Transaction.CreatePurchaseTransactionBody;

  const admin = await prisma.user.findFirst({
    where: {
      firebaseId: toAdminId,
    },
  });

  if (
    admin &&
    toAdminId &&
    toAdminId.length &&
    toAdminId === process.env.ADMIN_ID!
  ) {
    next();
  } else {
    next(Errors.Transaction.transactionUnauthenticated);
  }
};

export { isReceiverAdmin, isSenderManager };
