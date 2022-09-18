import { Router } from "express";

import * as Controllers from "@controllers";
import * as Utils from "@utils";

const router: Router = Router({ mergeParams: true });

router.post(
  "/tshirt",
  Utils.Upload.upload.single("paymentReceiptImg"),
  Controllers.Spark.createTshirtRequest
);

export default router;
