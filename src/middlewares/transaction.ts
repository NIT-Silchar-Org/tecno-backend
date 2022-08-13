import * as Interfaces from "@interfaces";

import * as Errors from "@errors";

const isSenderAdmin: Interfaces.Middleware.Sync = (req, _res, next) => {
  if (req.user && req.user.id === parseInt(process.env.ADMIN_ID!)) {
    next();
  } else {
    next(Errors.Transaction.transactionUnauthenticated);
  }
};

const isReceiverAdmin: Interfaces.Middleware.Async = async (
  req,
  _res,
  next
) => {
  const { toAdminId } =
    req.body as Interfaces.Transaction.CreatePurchaseTransactionBody;

  if (toAdminId && toAdminId.length && toAdminId === process.env.ADMIN_ID!) {
    next();
  } else {
    next(Errors.Transaction.transactionUnauthenticated);
  }
};

export { isSenderAdmin, isReceiverAdmin };
