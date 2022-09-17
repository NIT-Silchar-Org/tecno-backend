import { prisma } from "@utils/prisma";

import * as Interfaces from "@interfaces";
import * as Errors from "@errors";
import * as Utils from "@utils";

const getAllStatics: Interfaces.Controller.Async = async (_req, res) => {
  const statics = await prisma.statics.findMany();
  return res.json(Utils.Response.Success(statics));
};

const getStatics: Interfaces.Controller.Async = async (req, res, next) => {
  const { name } = req.params;

  const statics = await prisma.statics.findFirst({
    where: {
      name,
    },
  });

  if (!statics) {
    return next(Errors.Statics.noSuchStaticExist);
  }

  return res.json(Utils.Response.Success(statics));
};

export { getAllStatics, getStatics };
