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
  const { description, image, name } = req.body as Module;
  if (!description || !image || !name) return next(Errors.Module.invalidInput);

  const module = await prisma.module.create({
    data: {
      description,
      image,
      name,
    },
  });
  if (!module) return next(Errors.System.serverError);
  return res.json(Utils.Response.Success(module));
};
