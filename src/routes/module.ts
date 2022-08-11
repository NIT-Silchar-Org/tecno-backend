import { Router } from "express";
import * as Controllers from "@controllers";
import Event from "./event";
const router: Router = Router({ mergeParams: true });

router.post("/create", Controllers.Module.createModule);
router.get("/all", Controllers.Module.getAllModules);
router.get("/:moduleId", Controllers.Module.getModuleById);
router.delete("/:moduleId/delete", Controllers.Module.deleteModuleById);
router.use("/:moduleId/event/", Event);
router.patch("/:moduleId", Controllers.Module.updateModule);

export default router;
