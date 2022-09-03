import * as Interfaces from "@interfaces";
import { Module } from "@prisma/client";
import { prisma } from "@utils/prisma";
import * as Errors from "@errors";
import * as Utils from "@utils";

export const createModule: Interfaces.Controller.Async = async (
  req,
  res,
  next
) => {
  const { description, coverImage, iconImage, name, thirdPartyURL } =
    req.body as Module;
  if (!description || !coverImage || !iconImage || !name)
    return next(Errors.Module.invalidInput);

  if (
    typeof description !== "string" ||
    typeof coverImage !== "string" ||
    typeof iconImage !== "string" ||
    typeof name !== "string"
  )
    return next(Errors.Module.invalidInput);

  if (
    thirdPartyURL &&
    (typeof thirdPartyURL !== "string" || !thirdPartyURL.length)
  )
    return next(Errors.Module.invalidInput);

  const module = await prisma.module.create({
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
