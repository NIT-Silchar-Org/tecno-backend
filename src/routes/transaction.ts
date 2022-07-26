import { Router } from "express";

import * as Middlewares from "@middlewares";
import * as Controllers from "@controllers";

const router: Router = Router({ mergeParams: true });

// ROOT = /api/transaction

router.post(
  "/attendance",
  Middlewares.Auth.validateUser,
  Middlewares.Transaction.isUserEventManager,
  Middlewares.Auth.getAdmin,
  Controllers.Transaction.createNewAttendanceTransaction
);

router.post(
  "/purchase",
  Middlewares.Auth.validateUser,
  Middlewares.Transaction.isReceiverAdmin,
  Controllers.Transaction.createNewPurchaseTransaction
);

router.post(
  "/online-event",
  Middlewares.Auth.isAdmin,
  Middlewares.Auth.getAdmin,
  Controllers.Transaction.createNewOnlineEventTransaction
);

router.get(
  "/all",
  Middlewares.Auth.isAdmin,
  Controllers.Transaction.getAllTransactions
);

router.get(
  "/",
  Middlewares.Auth.validateUser,
  Controllers.Transaction.getAllTransactionsForAUser
);

export default router;
