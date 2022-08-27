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
  Middlewares.Transaction.isUserAdmin,
  Controllers.Transaction.createNewPurchaseTransaction
);

export default router;
