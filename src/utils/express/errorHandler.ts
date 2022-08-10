import { ErrorRequestHandler } from "express";

import * as Interfaces from "@interfaces";

const errorHandler: ErrorRequestHandler = (
  err: Interfaces.JSON.Response,
  _,
  res,
  next
) => {
  if (err) {
    res.status(err.status).json(err);
  } else {
    next();
  }
};

export { errorHandler };
