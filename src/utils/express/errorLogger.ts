import { ErrorRequestHandler } from "express";

const errorLogger: ErrorRequestHandler = (err, _, __, next) => {
  if (err) {
    console.error(err);
  }

  next(err);
  // next();
};

export { errorLogger };
