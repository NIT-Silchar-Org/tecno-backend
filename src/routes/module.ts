import { Router } from "express";
import * as Controllers from "@controllers";
import * as Middlewares from "@middlewares";
const router: Router = Router({ mergeParams: true });

//TODO:transfer C_UD API to admin pannel
router.post(
  "/create",
  Middlewares.Auth.isAdmin,
  Controllers.Module.createModule
);
router.get("/:moduleId/event", Controllers.Event.getEventsByModule);
router.get("/:moduleId", Controllers.Module.getModuleById);
router.get("/", Controllers.Module.getAllModules);
router.delete(
  "/:moduleId/",
  Middlewares.Auth.isAdmin,
  Controllers.Module.deleteModuleById
);
router.patch(
  "/:moduleId",
  Middlewares.Auth.isAdmin,
  Controllers.Module.updateModule
);

export default router;
