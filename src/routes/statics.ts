import { Router } from "express";

import * as Controllers from "@controllers";
import * as Middlewares from "@middlewares";

const router: Router = Router({ mergeParams: true });

router.get("/", Controllers.Statics.getAllStatics);
router.get("/:name", Controllers.Statics.getStatics);

router.post("/", Middlewares.Auth.isAdmin, Controllers.Statics.createStatics);

router.put(
  "/:name",
  Middlewares.Auth.isAdmin,
  Controllers.Statics.updateStatics
);

router.delete(
  "/:name",
  Middlewares.Auth.isAdmin,
  Controllers.Statics.deleteStatics
);

export default router;
