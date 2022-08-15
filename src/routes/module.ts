import { Router } from "express";
import * as Controllers from "@controllers";
import * as Middlewares from "@middlewares";
const router: Router = Router({ mergeParams: true });

//TODO:transfer C_UD API to admin pannel
router.post(
  "/create",
  Middlewares.Module.isAdmin,
  Controllers.Module.createModule
);
router.get("/all", Controllers.Module.getAllModules);
router.get("/:moduleId", Controllers.Module.getModuleById);
router.delete(
  "/:moduleId/delete",
  Middlewares.Module.isAdmin,
  Controllers.Module.deleteModuleById
);
router.patch(
  "/:moduleId",
  Middlewares.Module.isAdmin,
  Controllers.Module.updateModule
);

export default router;
