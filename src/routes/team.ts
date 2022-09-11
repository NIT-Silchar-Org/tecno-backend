import { Router } from "express";

import * as Controllers from "@controllers";
import * as Middlewares from "@middlewares";

const router: Router = Router({ mergeParams: true });

// ROOT = /api/:eventId

router.post("/team/add", Controllers.Team.registerTeam);

// router.delete("/:teamId");

router.get("/team/:teamId", Controllers.Team.getTeamDetails);
router.get("/registered_teams/", Controllers.Team.getAllTeamsOfEvent);
router.patch(
  // "/team/:teamId/:userId/respond",
  "/team/:teamId/respond",
  Middlewares.Auth.getAdmin,
  Controllers.Team.teamRegistrationResponse
); // check user middleware // Get userId from auth

export default router;
