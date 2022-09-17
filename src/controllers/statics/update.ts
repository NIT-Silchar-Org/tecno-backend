import { prisma } from "@utils/prisma";

import * as Interfaces from "@interfaces";
import * as Success from "@success";
import * as Errors from "@errors";

const updateStatics: Interfaces.Controller.Async = async (req, res, next) => {
  const { name } = req.params;

  const { json } = req.body as Interfaces.Statics.StaticsCreateBody;

  if (!json) {
    return next(Errors.Statics.invalidInput);
  }

  const statics = await prisma.statics.findFirst({
    where: {
      name,
    },
  });

  if (!statics) {
    return next(Errors.Statics.noSuchStaticExist);
  }

  await prisma.statics.update({
    where: {
      name,
    },
    data: {
      json,
    },
  });

  return res.json(Success.Statics.staticSuccessfullyUpdated);
};

export { updateStatics };
