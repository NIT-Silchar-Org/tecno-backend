import * as Utils from "@utils";

const staticSuccessfullyCreated = Utils.Response.Success(
  "Statics Created sucessfully."
);
const staticSuccessfullyUpdated = Utils.Response.Success(
  "Statics Updated sucessfully."
);
const staticSuccessfullyDeleted = Utils.Response.Success(
  "Statics Deleted sucessfully."
);

export {
  staticSuccessfullyCreated,
  staticSuccessfullyUpdated,
  staticSuccessfullyDeleted,
};
