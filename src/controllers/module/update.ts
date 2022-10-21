import * as Interfaces from "@interfaces";
import { Module } from "@prisma/client";
import { prisma } from "@utils/prisma";
import * as Errors from "@errors";
import * as Utils from "@utils";

const updateModule: Interfaces.Controller.Async = async (req, res, next) => {
  const { description, iconImage, coverImage, name, thirdPartyURL } =
    req.body as Module;
  const { moduleId: MID } = req.params;
  const moduleId = Number.parseInt(MID);
  if (isNaN(moduleId)) return next(Errors.Module.invalidInput);
  if (!(await prisma.module.findFirst({ where: { id: moduleId } })))
    return next(Errors.Module.moduleNotFound);

  if (
    (description && typeof description !== "string") ||
    (iconImage && typeof iconImage !== "string") ||
    (coverImage && typeof coverImage !== "string") ||
    (name && typeof name !== "string") ||
    (thirdPartyURL && typeof thirdPartyURL !== "string")
  )
    return next(Errors.Module.invalidInput);

  if (
    (typeof description === "string" && !description.length) ||
    (typeof iconImage === "string" && !iconImage.length) ||
    (typeof coverImage === "string" && !coverImage.length) ||
    (typeof name === "string" && !name.length) ||
    (typeof thirdPartyURL === "string" && !thirdPartyURL.length)
  )
    return next(Errors.Module.invalidInput);

  const module = await prisma.module.update({
    where: { id: moduleId },
    data: {
      description,
      iconImage,
      coverImage,
      name,
      thirdPartyURL,
    },
  });

  if (!module) return next(Errors.System.serverError);
  return res.json(Utils.Response.Success(module));
};

export { updateModule };
