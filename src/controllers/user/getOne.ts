import * as Interfaces from "@interfaces";
import * as Success from "@success";
import * as Error from "@errors";

import { prisma } from "@utils/prisma";
import { User } from "@prisma/client";

const getOneUserById: Interfaces.Controller.Async = async (req, res, next) => {
  const id = parseInt(req?.params?.id);

  const user = await prisma.user.findFirst({
    where: {
      id: id,
    },
  });

  if (!user) {
    return next(Error.User.userNotFound);
  }

  return res.json(Success.User.getOneUserResponse(user as User));
};

export { getOneUserById };
