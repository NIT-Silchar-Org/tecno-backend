import * as Utils from "@utils";

const invalidInput = Utils.Response.Error("Invalid input", 400);
const duplicateKey = Utils.Response.Error(
  "Request already exists. Duplicate key found.",
  400
);

export { invalidInput, duplicateKey };
