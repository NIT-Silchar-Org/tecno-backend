import { Router } from "express";

import * as Controllers from "@controllers";

const router: Router = Router({ mergeParams: true });

router.get("/", Controllers.User.getAllUsers);
router.get("/:id", Controllers.User.getOneUserById);

export default router;
