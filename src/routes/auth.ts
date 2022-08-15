import { Router } from "express";

import * as Controllers from "@controllers";

const router: Router = Router({ mergeParams: true });

router.get("/signUp", Controllers.Auth.signUp);

export default router;
