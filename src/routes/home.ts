import { Router } from "express";

import * as Controllers from "@controllers";

const router: Router = Router({ mergeParams: true });

// ROOT: /api/vx/home

router.get("/", Controllers.Home.sayHello);

export default router;
