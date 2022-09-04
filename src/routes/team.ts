import { Router } from "express";

import * as Controllers from "@controllers";
import * as Middlewares from "@middlewares";

const router: Router = Router({ mergeParams: true });

// ROOT = /api/team

router.post("/add", Controllers.Team.registerTeam);

router.get(
  "/:teamId",
  Middlewares.Team.isValidTeamId,
  Controllers.Team.getTeamDetails
);

router.patch(
  "/:teamId/respond",
  Middlewares.Team.isValidTeamId,
  Controllers.Team.teamRegistrationResponse
); // check user middleware // Get userId from auth

export default router;
