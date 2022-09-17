import * as Utils from "@utils";

const userNotPartOfTeam = Utils.Response.Error(
  "User is not part of team.",
  409
);

const userAlreadyResponded = Utils.Response.Error(
  "User already accepted/rejected invitation",
  409
);

const teamRegistrationCancelled = Utils.Response.Error(
  "Team Registration is Cancelled.",
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

const memberDuplicates = Utils.Response.Error(
  "Duplication of Members is not allowed.",
  409
);

const teamSizeNotAllowed = Utils.Response.Error(
  "Team size isn't allowed.",
  400
);
const teamNotFound = Utils.Response.Error("Team not found.", 404);
const invalidTeamId = Utils.Response.Error("Invalid Team ID", 401);

const timeNotRight = Utils.Response.Error("Can not register now.", 401);

export {
  userNotPartOfTeam,
  userAlreadyResponded,
  teamRegistrationCancelled,
  userAlreadyRegistered,
  teamAlreadyExists,
  invalidResponse,
  teamSizeNotAllowed,
  teamNotFound,
  memberDuplicates,
  invalidTeamId,
  timeNotRight,
};
