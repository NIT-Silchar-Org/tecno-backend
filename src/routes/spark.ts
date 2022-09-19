import { Router } from "express";

import * as Controllers from "@controllers";
import * as Middlewares from "@middlewares";
import * as Utils from "@utils";

const router: Router = Router({ mergeParams: true });

router.post(
  "/tshirt",
  Utils.Upload.upload.single("paymentReceiptImg"),
  Middlewares.Upload.uploadErrors,
  Controllers.Spark.createTshirtRequest
);

export default router;
