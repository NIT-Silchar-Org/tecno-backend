import { ErrorRequestHandler } from "express";

import * as Interfaces from "@interfaces";

const errorLogger: ErrorRequestHandler = (
  err: Interfaces.JSON.Response,
  _,
  __,
  next
) => {
  if (err) {
    console.error(`Error Code: ${err.status}, Message: ${err.msg}`);
  }

  next(err);
};

export { errorLogger };
