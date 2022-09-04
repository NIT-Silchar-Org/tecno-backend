import { Router } from "express";
import * as Controllers from "@controllers";
import * as Middlewares from "@middlewares";

const router: Router = Router({ mergeParams: true });

//TODO:transfer C_UD API to admin pannel
router.post("/create", Middlewares.Auth.isAdmin, Controllers.Event.createEvent);
router.get("/module/:moduleId", Controllers.Event.getEventsByModule);

router.get("/all", Controllers.Event.getAllEventsNested);

router.get("/:eventId", Controllers.Event.getEventById);
router.get("/", Controllers.Event.getAllEvents);
router.get("/all", Controllers.Event.getAllEventsNested);
router.patch(
  "/:eventId/",
  Middlewares.Auth.isAdmin,
  Controllers.Event.updateEvent
);
router.delete(
  "/:eventId/delete",
  Middlewares.Auth.isAdmin,
  Controllers.Event.deleteEvent
);

export default router;
