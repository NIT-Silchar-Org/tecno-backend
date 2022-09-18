import { ErrorRequestHandler } from "express";

import * as Utils from "@utils";

const uploadErrors: ErrorRequestHandler = (err, _, _res, next) => {
  if (err) {
    console.log(err);
    return next(
      Utils.Response.Error("File of large size or unknown type.", 413)
    );
  } else {
    return next();
  }
};

export { uploadErrors };
