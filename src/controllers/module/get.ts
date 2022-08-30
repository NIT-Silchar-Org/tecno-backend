import * as Interfaces from "@interfaces";
import * as Errors from "@errors";
import { prisma } from "@utils/prisma";
import * as Utils from "@utils";

export const getAllModules: Interfaces.Controller.Async = async (
  _req,
  res,
  next
) => {
  const modules = await prisma.module.findMany();
  if (!modules) return next(Errors.System.serverError);
  return res.json(Utils.Response.Success(modules));
};
export const getModuleById: Interfaces.Controller.Async = async (
  req,
  res,
  next
) => {
  const { moduleId: MID } = req.params;
  const moduleId = Number.parseInt(MID);
  if (isNaN(moduleId)) return next(Errors.Module.invalidInput);

  const module = await prisma.module.findFirst({ where: { id: moduleId } });
  if (!module) return next(Errors.Module.moduleNotFound);
  return res.json(Utils.Response.Success(module));
};
