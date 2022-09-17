import * as Utils from "@utils";

const eventDoesntExist = Utils.Response.Error("Event doesn't exist.", 404);

export { eventDoesntExist };
