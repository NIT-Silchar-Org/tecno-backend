import { Router } from "express";

import * as Controllers from "@controllers";

const router: Router = Router({ mergeParams: true });

router.post("/", Controllers.Spark.createTshirtRequest);

export default router;
