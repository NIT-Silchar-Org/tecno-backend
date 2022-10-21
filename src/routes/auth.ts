import { Router } from "express";

import * as Controllers from "@controllers";

const router: Router = Router({ mergeParams: true });

router.post("/signUp", Controllers.Auth.signUp);

export default router;
