import * as Interfaces from "@interfaces";
import { Module } from "@prisma/client";
import { prisma } from "@utils/prisma";
import * as Errors from "@errors";
import * as Utils from "@utils";

export const updateModule: Interfaces.Controller.Async = async (
  req,
  res,
  next
) => {
  const { description, image, name, thirdPartyURL } = req.body as Module;
  const { moduleId: MID } = req.params;
  const moduleId = Number.parseInt(MID);
  if (isNaN(moduleId)) return next(Errors.Module.invalidInput);
  if (!(await prisma.module.findFirst({ where: { id: moduleId } })))
    return next(Errors.Module.moduleNotFound);

  const module = await prisma.module.update({
    where: { id: moduleId },
    data: {
      description,
      image,
      name,
      thirdPartyURL,
    },
  });

  if (!module) return next(Errors.System.serverError);
  return res.json(Utils.Response.Success(module));
};
