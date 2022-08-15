import * as Interfaces from "@interfaces";

import * as Errors from "@errors";

const isAdmin: Interfaces.Middleware.Sync = (req, _res, next) => {
  if (req.user && req.user.id === parseInt(process.env.ADMIN_ID!)) {
    next();
  } else {
    next(Errors.Module.userUnauthorized);
  }
};

export { isAdmin };
