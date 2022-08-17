import * as Utils from "@utils";

const userNotPartOfTeam = Utils.Response.Error(
  "User is not part of team.",
  409
);

const userRegistrationNotPending = Utils.Response.Error(
  "User already accepted/rejected invitation",
  409
);

const userAlreadyRegistered = Utils.Response.Error(
  "User(s) Already Registered for Event.",
  409
);

const teamAlreadyExists = Utils.Response.Error(
  "Team name taken for the event.",
  409
);

const invalidResponse = Utils.Response.Error("Invalid Response.");

const teamSizeNotAllowed = Utils.Response.Error(
  "Team size isn't allowed.",
  400
);
const teamNotFound = Utils.Response.Error("Team not found.", 404);

export {
  userNotPartOfTeam,
  userRegistrationNotPending,
  userAlreadyRegistered,
  teamAlreadyExists,
  invalidResponse,
  teamSizeNotAllowed,
  teamNotFound,
};
