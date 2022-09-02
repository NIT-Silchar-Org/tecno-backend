import { Router } from "express";

import * as Controllers from "@controllers";

const router: Router = Router({ mergeParams: true });

router.get("/", Controllers.User.getAllUsers);
router.get("/me", Controllers.User.getLogedInUser);
router.get("/:id", Controllers.User.getOneUserById);
router.patch("/", Controllers.User.updateUserDetails);

export default router;
