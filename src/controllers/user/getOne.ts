import * as Interfaces from "@interfaces";
import * as Success from "@success";
import * as Error from "@errors";

import { prisma } from "@utils/prisma";
import { User } from "@prisma/client";

const getOneUserById: Interfaces.Controller.Async = async (req, res, next) => {
  const id = parseInt(req?.params?.id);

  if (isNaN(id)) {
    return next(Error.User.badRequest("Incorrect user id"));
  }

  const user = await prisma.user.findFirst({
    where: {
      id: id,
    },
    include: {
      manages: true,
      organizes: true,
      to: true,
      from: true,
      teamsRegistered: true,
    },
  });

  if (!user) {
    return next(Error.User.userNotFound);
  }

  return res.json(Success.User.getOneUserResponse(user as User));
};

export { getOneUserById };
