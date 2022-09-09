import { Router } from "express";

import * as Controllers from "@controllers";
import * as Middlewares from "@middlewares";

const router: Router = Router({ mergeParams: true });

router.get("/", Middlewares.Auth.isAdmin, Controllers.User.getAllUsers);
router.get("/me/attended_events", Controllers.User.getAllAttendedEventsOfUser);
router.get("/me", Controllers.User.getLogedInUser);
router.get("/:id", Middlewares.Auth.isAdmin, Controllers.User.getOneUserById);
router.patch("/", Controllers.User.updateUserDetails);

export default router;
