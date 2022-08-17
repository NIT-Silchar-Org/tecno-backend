import { ErrorRequestHandler } from "express";
import { FirebaseError } from "firebase-admin";

import * as Utils from "@utils";
import * as Errors from "@errors";
import * as Interfaces from "@interfaces";

const errorHandler: ErrorRequestHandler = (
  err: Error | Interfaces.JSON.Response | FirebaseError,
  _,
  res,
  next
) => {
  if (Utils.Firebase.isFirebaseError(err)) {
    res.status(500).json(Errors.Auth.firebaseAuthError);
  } else if (err instanceof Error) {
    res.status(500).json(Errors.System.serverError);
  } else if (err) {
    res.status(err.status).json(err);
  } else {
    next();
  }
};

export { errorHandler };
