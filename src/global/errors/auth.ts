import * as Utils from "@utils";

const firebaseAuthError = Utils.Response.Error(
  "Firebase authentication error."
);
const adminAuthError = Utils.Response.Error("Admin unauthorized.");

export { firebaseAuthError, adminAuthError };
