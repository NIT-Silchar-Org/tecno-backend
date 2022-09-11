import { Router } from "express";

import * as Controllers from "@controllers";
import * as Middlewares from "@middlewares";

const router: Router = Router({ mergeParams: true });

// ROOT = /api/:eventId

router.post(
  "/team/add",
  Middlewares.Auth.validateUser,
  Controllers.Team.registerTeam
);

// router.delete("/:teamId");

router.get(
  "/team/:teamId",
  Middlewares.Auth.validateUser,
  Controllers.Team.getTeamDetails
);
router.get(
  "/registered_teams/",
  Middlewares.Auth.isAdmin,
  Controllers.Team.getAllTeamsOfEvent
);
router.patch(
  // "/team/:teamId/:userId/respond",
  "/team/:teamId/respond",
  Middlewares.Auth.validateUser,
  Controllers.Team.teamRegistrationResponse
); // check user middleware // Get userId from auth

export default router;
