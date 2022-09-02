import { Router } from "express";
import * as Controllers from "@controllers";
import * as Middlewares from "@middlewares";

import Team from "./team";

const router: Router = Router({ mergeParams: true });

//TODO:transfer C_UD API to admin pannel
router.post(
  "/create",
  Middlewares.Module.isAdmin,
  Controllers.Event.createEvent
);
router.get("/module/:moduleId", Controllers.Event.getEventsByModule);

router.get("/all", Controllers.Event.getAllEventsNested);
router.use("/:eventId", Team);

router.get("/:eventId", Controllers.Event.getEventById);
router.get("/", Controllers.Event.getAllEvents);
router.patch(
  "/:eventId/",
  Middlewares.Module.isAdmin,
  Controllers.Event.updateEvent
);
router.delete(
  "/:eventId/delete",
  Middlewares.Module.isAdmin,
  Controllers.Event.deleteEvent
);

export default router;
