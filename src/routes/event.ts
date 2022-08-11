import { Router } from "express";
import * as Controllers from "@controllers";
const router: Router = Router({ mergeParams: true });

router.post("/create", Controllers.Event.createEvent);
router.get("/all", Controllers.Event.getEventsByModule);
router.get("/:eventId/", Controllers.Event.getEventInModuleById);
router.patch("/:eventId/update", Controllers.Event.updateEvent);
router.delete("/:eventId/delete", Controllers.Event.deleteEvent);

export default router;
