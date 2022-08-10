import { ErrorRequestHandler } from "express";
import pc from "picocolors";

import * as Interfaces from "@interfaces";

const errorLogger: ErrorRequestHandler = (
  err: Interfaces.JSON.Response,
  _,
  __,
  next
) => {
  if (err) {
    console.error(
      "Error Code:" +
        pc.bgRed(pc.black(` ${pc.italic(err.status)} `)) +
        ", Message: " +
        pc.bgRed(pc.black(` ${pc.italic(err.msg)} `))
    );
  }

  next(err);
};

export { errorLogger };
