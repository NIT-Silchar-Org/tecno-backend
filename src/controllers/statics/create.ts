import { prisma } from "@utils/prisma";

import * as Interfaces from "@interfaces";
import * as Success from "@success";
import * as Errors from "@errors";

const createStatics: Interfaces.Controller.Async = async (req, res, next) => {
  const { json, name } = req.body as Interfaces.Statics.StaticsCreateBody;

  const statics = await prisma.statics.findFirst({
    where: {
      name,
    },
  });

  if (!name || !name.length || !json) {
    return next(Errors.Statics.invalidInput);
  }

  if (statics) {
    return next(Errors.Statics.staticWithTheNameAlreadyExists(statics.name));
  }

  await prisma.statics.create({
    data: {
      name,
      json,
    },
  });

  return res.json(Success.Statics.staticSuccessfullyCreated);
};

export { createStatics };
