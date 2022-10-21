import * as Utils from "@utils";

const invalidInput = Utils.Response.Error("Invalid input", 400);
const moduleNotFound = Utils.Response.Error("Module does not exist", 404);
const eventNotFound = Utils.Response.Error("Event does not exist", 404);
const userUnauthorized = Utils.Response.Error(
  "User is not authorized to perform the request",
  403
);

const extraQuestionsJSONInvalid = Utils.Response.Error(
  "extra questions misc JSON in invalid"
);

export {
  invalidInput,
  moduleNotFound,
  eventNotFound,
  userUnauthorized,
  extraQuestionsJSONInvalid,
};
