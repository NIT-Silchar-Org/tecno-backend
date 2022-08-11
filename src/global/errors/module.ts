import * as Utils from "@utils";

const invalidInput = Utils.Response.Error("Invalid input", 400);
const moduleNotFound = Utils.Response.Error("Module does not exist", 404);
const eventNotFound = Utils.Response.Error("Event does not exist", 404);

export { invalidInput, moduleNotFound, eventNotFound };
