import * as Utils from "@utils";

const invalidInput = Utils.Response.Error("Invalid input", 400);
const duplicateKey = Utils.Response.Error(
  "Request already exists. Duplicate key found.",
  400
);
const sparkFormClosed = Utils.Response.Error(
  "Form is no longer accepting responses.",
  400
);

export { invalidInput, duplicateKey, sparkFormClosed };
