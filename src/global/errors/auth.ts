import * as Utils from "@utils";

const userNotAuthenticated = Utils.Response.Error(
  "user Not authenticated",
  401
);

export { userNotAuthenticated };
