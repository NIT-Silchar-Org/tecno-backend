import * as Interfaces from "@interfaces";
import * as Errors from "@errors";
import { prisma } from "@utils/prisma";
import success from "@utils/response/success";

export const getAllModules: Interfaces.Controller.Async = async (
  _req,
  res,
  next
) => {
  const modules = await prisma.module.findMany();
  if (!modules) return next(Errors.System.serverError);
  return res.json(success(modules));
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
  if (!module) return next(Errors.System.serverError);
  return res.json(success(module));
};
