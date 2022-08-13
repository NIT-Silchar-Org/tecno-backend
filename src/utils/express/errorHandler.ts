import { ErrorRequestHandler } from "express";

import * as Errors from "@errors";
import * as Interfaces from "@interfaces";

const errorHandler: ErrorRequestHandler = (
  err: Error | Interfaces.JSON.Response,
  _,
  res,
  next
) => {
  if (err instanceof Error) {
    res.status(500).json(Errors.System.serverError);
  } else if (err) {
    res.status(err.status).json(err);
  } else {
    next();
  }
};

export { errorHandler };
