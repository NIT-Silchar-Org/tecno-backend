import * as Utils from "@utils";

const userNotPartOfTeam = Utils.Response.Error("User is not part of team.");
const userRegistrationNotPending = Utils.Response.Error(
  "User already accepted/rejected invitation"
);
const userAlreadyRegistered = Utils.Response.Error(
  "User(s) Already Registered for Event."
);

const teamAlreadyExists = Utils.Response.Error(
  "Team name taken for the event."
);
const invalidResponse = Utils.Response.Error("Invalid Response.");

const teamSizeNotAllowed = Utils.Response.Error("Team size isn't allowed.");
const teamNotFound = Utils.Response.Error("Team not found.");

export {
  userNotPartOfTeam,
  userRegistrationNotPending,
  userAlreadyRegistered,
  teamAlreadyExists,
  invalidResponse,
  teamSizeNotAllowed,
  teamNotFound,
};
