import { Router } from "express";
import * as Controllers from "@controllers";
import * as Middlewares from "@middlewares";

const router: Router = Router({ mergeParams: true });

router.post("/create", Middlewares.Auth.isAdmin, Controllers.Event.createEvent);

router.get("/:eventId", Controllers.Event.getEventById);
router.get("/", Controllers.Event.getAllEvents);
router.patch(
  "/:eventId/",
  Middlewares.Auth.isAdmin,
  Controllers.Event.updateEvent
);
router.delete(
  "/:eventId/",
  Middlewares.Auth.isAdmin,
  Controllers.Event.deleteEvent
);

export default router;
