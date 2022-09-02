import * as Interfaces from "@interfaces";
import * as Success from "@success";
import * as Error from "@errors";

import { User } from "@prisma/client";

const getLogedInUser: Interfaces.Controller.Async = async (req, res, next) => {
  const user = req?.user;

  if (!user) {
    return next(Error.User.userNotFound);
  }

  return res.json(Success.User.getOneUserResponse(user as User));
};

export { getLogedInUser };
