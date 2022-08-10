import { ErrorRequestHandler } from "express";

import * as Utils from "@utils";

const errorHandler: ErrorRequestHandler = (err, _, res, next) => {
  if (err) {
    res.status(500).send(Utils.Response.Error(err));
  } else {
    next();
  }
};

export { errorHandler };
