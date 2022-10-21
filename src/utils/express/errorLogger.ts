import { ErrorRequestHandler } from "express";
import { FirebaseError } from "firebase-admin";

import pc from "picocolors";

import * as Utils from "@utils";
import * as Interfaces from "@interfaces";

const errorLogger: ErrorRequestHandler = (
  err: Error | Interfaces.JSON.Response | FirebaseError,
  _,
  __,
  next
) => {
  if (Utils.Firebase.isFirebaseError(err)) {
    console.log(err);
  } else if (err instanceof Error) {
    console.error(err);
  } else if (err) {
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
