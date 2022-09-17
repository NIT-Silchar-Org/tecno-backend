import { prisma } from "@utils/prisma";

import * as Interfaces from "@interfaces";
import * as Success from "@success";
import * as Errors from "@errors";

const deleteStatics: Interfaces.Controller.Async = async (req, res, next) => {
  const { name } = req.params;

  const statics = await prisma.statics.findFirst({
    where: {
      name,
    },
  });

  if (!statics) {
    return next(Errors.Statics.noSuchStaticExist);
  }

  await prisma.statics.delete({
    where: {
      name,
    },
  });

  return res.json(Success.Statics.staticSuccessfullyDeleted);
};

export { deleteStatics };
