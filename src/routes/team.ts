import { Router } from "express";

import * as Controllers from "@controllers";

const router: Router = Router({ mergeParams: true });

// ROOT = /api/:moduleId/:eventId

router.post("/add", Controllers.Team.registerTeam);

// router.delete("/:teamId");

router.get("/:teamId", Controllers.Team.getTeamDetails);
router.patch(
  "/:teamId/:userId/respond",
  Controllers.Team.teamRegistrationResponse
); // check user middleware // Get userId from auth

export default router;
