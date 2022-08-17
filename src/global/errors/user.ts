import * as Utils from "@utils";

const userNotAuthenticated = Utils.Response.Error(
  "User Not authenticated",
  401
);

const userNotFound = Utils.Response.Error("User not found", 404);

const badRequest = Utils.Response.Error("bad Request", 400);
const userAlreadyExists = Utils.Response.Error(
  "User exist with same parameters",
  400
);

export { userNotAuthenticated, userNotFound, badRequest, userAlreadyExists };
