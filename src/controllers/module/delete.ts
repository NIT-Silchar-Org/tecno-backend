import * as Interfaces from "@interfaces";
import * as Errors from "@errors";
import { prisma } from "@utils/prisma";
import success from "@utils/response/success";

export const deleteModuleById: Interfaces.Controller.Async = async (
  req,
  res,
  next
) => {
  const { moduleId: MID } = req.params;
  const moduleId = Number.parseInt(MID);
  if (isNaN(moduleId)) return next(Errors.Module.invalidInput);
  if (!(await prisma.module.findFirst({ where: { id: moduleId } })))
    return next(Errors.Module.moduleNotFound);

  const module = await prisma.module.delete({ where: { id: moduleId } });
  if (!module) return next(Errors.System.serverError);
  return res.json(success(module));
};
