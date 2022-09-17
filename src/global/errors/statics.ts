import * as Utils from "@utils";

const staticWithTheNameAlreadyExists = (name: string) =>
  Utils.Response.Error(`Statics with the name ${name} already exists.`, 409);

const noSuchStaticExist = Utils.Response.Error("No such statics exists.", 404);

const invalidInput = Utils.Response.Error("Invalid input", 400);

export { staticWithTheNameAlreadyExists, invalidInput, noSuchStaticExist };
