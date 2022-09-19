import * as Interfaces from "@interfaces";

import * as Errors from "@errors";

const isValidTeamId: Interfaces.Middleware.Sync = (req, _res, next) => {
  const { teamId } = req.params;

  if (isNaN(parseInt(teamId))) {
    return next(Errors.Team.invalidTeamId);
  } else {
    return next();
  }
};

export { isValidTeamId };
