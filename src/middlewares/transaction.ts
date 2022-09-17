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

  if (isNaN(parseInt(eventId))) {
    return next(Errors.Event.eventDoesntExist);
  }

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

const isReceiverAdmin: Interfaces.Middleware.Async = async (
  req,
  _res,
  next
) => {
  const { toUserName } =
    req.body as Interfaces.Transaction.CreatePurchaseTransactionBody;

  const admin = await prisma.user.findFirst({
    where: {
      username: toUserName,
    },
  });

  if (
    toUserName &&
    toUserName.length &&
    admin &&
    admin.firebaseId === process.env.ADMIN_ID!
  ) {
    next();
  } else {
    next(Errors.Auth.adminAuthError);
  }
};

const isUserAuthorized: Interfaces.Middleware.Sync = (req, _res, next) => {
  const { userId } = req.params;
  if (req.user!.id === parseInt(userId)) {
    next();
  } else {
    next(Errors.Auth.userUnauthorized);
  }
};

export { isUserEventManager, isReceiverAdmin, isUserAuthorized };
