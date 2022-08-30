import * as Utils from "@utils";

const userNotAuthenticated = Utils.Response.Error(
  "User Not authenticated",
  401
);

const userNotFound = Utils.Response.Error("User not found", 404);

const badRequest = (msg = "Bad request") => {
  return Utils.Response.Error(msg, 400);
};

const userAlreadyExists = Utils.Response.Error(
  "User exist with same parameters",
  400
);

export { userNotAuthenticated, userNotFound, badRequest, userAlreadyExists };
