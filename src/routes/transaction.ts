import { Router } from "express";

import * as Middlewares from "@middlewares";
import * as Controllers from "@controllers";

const router: Router = Router({ mergeParams: true });

// ROOT = /api/transaction

router.post(
  "/attendance",
  Middlewares.Transaction.isUserEventManager,
  Middlewares.Auth.getAdmin,
  Controllers.Transaction.createNewAttendanceTransaction
);

router.post(
  "/purchase",
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
  "/",
  Middlewares.Auth.isAdmin,
  Controllers.Transaction.getAllTransactions
);

router.get(
  "/:userId",
  Middlewares.Transaction.isUserAuthorized,
  Controllers.Transaction.getAllTransactionsForAUser
);

export default router;
