import { Request, Response } from "express";

import * as Errors from "@errors";
// import * as Success from "@success";

function sayHello(_: Request, res: Response) {
  // res.json(Success.Home.hello);
  res.json(Errors.System.serverError);
}

export { sayHello };
