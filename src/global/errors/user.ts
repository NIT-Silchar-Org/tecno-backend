import * as Utils from "@utils";

const userNotAuthenticated = Utils.Response.Error(
  "user Not authenticated",
  401
);

const userNotFound = Utils.Response.Error("user not found", 404);

const badRequest = Utils.Response.Error("bad Request", 400);
const userAlreadyExists = Utils.Response.Error(
  "user exist with same parameters",
  409
);

export { userNotAuthenticated, userNotFound, badRequest, userAlreadyExists };
