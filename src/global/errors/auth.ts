import * as Utils from "@utils";

const firebaseAuthError = Utils.Response.Error(
  "Firebase authentication error."
);
const adminAuthError = Utils.Response.Error("Admin unauthorized.");
const userUnauthorized = Utils.Response.Error("User unauthorized.");

export { firebaseAuthError, adminAuthError, userUnauthorized };
