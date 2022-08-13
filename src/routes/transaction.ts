import { Router } from "express";

import * as Middlewares from "@middlewares";
import * as Controllers from "@controllers";

const router: Router = Router({ mergeParams: true });

// ROOT = /api/module/:id/event/:eventId/transaction

router.post(
  "/",
  Middlewares.Transaction.isSenderAdmin,
  Controllers.Transaction.createNewAttendanceTransaction
);

router.post(
  "/purchase",
  Middlewares.Transaction.isReceiverAdmin,
  Controllers.Transaction.createNewPurchaseTransaction
);

export default router;
