import { prisma } from "@utils/prisma";

import * as Utils from "@utils";
import * as Interfaces from "@interfaces";
import * as Errors from "@errors";

const validateUser: Interfaces.Middleware.Async = async (req, _res, next) => {
  const auth: string | undefined = req?.headers?.authorization;

  if (!auth) {
    return next(Errors.User.badRequest("Auth token is missing"));
  }

  const idToken: string = (auth as string).split(" ")[1];

  const firebaseAuth = Utils.Firebase.firebaseAdmin.auth();
  let decodedToken;
  try {
    if (process.env.NODE_ENV === "development") {
      decodedToken = {
        uid: idToken,
      };
    } else {
      decodedToken = await firebaseAuth.verifyIdToken(idToken);
    }
  } catch (err) {
    return next(err);
  }

  if (!decodedToken) {
    return next(Errors.User.userNotAuthenticated);
  }

  const { uid } = decodedToken;

  const user = await prisma.user.findFirst({
    where: {
      firebaseId: uid,
    },
    include: {
      manages: {
        select: {
          name: true,
          id: true,
          attendanceIncentive: true,
          registrationIncentive: true,
          description: true,
          maxTeamSize: true,
          minTeamSize: true,
          venue: true,
          prizeDescription: true,
          stagesDescription: true,
        },
      },
      organizes: {
        select: {
          name: true,
          id: true,
          attendanceIncentive: true,
          registrationIncentive: true,
          description: true,
          maxTeamSize: true,
          minTeamSize: true,
          venue: true,
          prizeDescription: true,
          stagesDescription: true,
        },
      },
    },
  });

  if (!user) {
    return next(Errors.User.userNotFound);
  }

  req.user = user;

  return next();
};

const getAdmin: Interfaces.Middleware.Async = async (req, _res, next) => {
  const admin = await prisma.user.findFirst({
    where: {
      firebaseId: process.env.ADMIN_ID!,
    },
  });
  if (!admin) {
    return next(Errors.Auth.adminAuthError);
  }

  req.admin = admin;
  return next();
};

const isAdmin: Interfaces.Middleware.Async = async (req, _res, next) => {
  const auth: string | undefined = req?.headers?.authorization;

  if (!auth) {
    return next(Errors.User.badRequest("Auth token is missing"));
  }

  const idToken: string = (auth as string).split(" ")[1];

  const firebaseAuth = Utils.Firebase.firebaseAdmin.auth();
  let decodedToken;
  try {
    if (process.env.NODE_ENV === "development") {
      decodedToken = {
        uid: idToken,
      };
    } else {
      decodedToken = await firebaseAuth.verifyIdToken(idToken);
    }
  } catch (err) {
    return next(err);
  }

  if (!decodedToken) {
    return next(Errors.User.userNotAuthenticated);
  }

  const { uid } = decodedToken;

  const admin = await prisma.user.findFirst({
    where: {
      firebaseId: uid,
    },
  });

  if (admin && admin.firebaseId === process.env.ADMIN_ID!) {
    return next();
  } else {
    return next(Errors.Auth.adminAuthError);
  }
};

const isOrganizerOrAdmin: Interfaces.Middleware.Async = async (
  req,
  _res,
  next
) => {
  const auth: string | undefined = req?.headers?.authorization;

  if (!auth) {
    return next(Errors.User.badRequest("Auth token is missing"));
  }

  const idToken: string = (auth as string).split(" ")[1];

  const firebaseAuth = Utils.Firebase.firebaseAdmin.auth();
  let decodedToken;
  try {
    if (process.env.NODE_ENV === "development") {
      decodedToken = {
        uid: idToken,
      };
    } else {
      decodedToken = await firebaseAuth.verifyIdToken(idToken);
    }
  } catch (err) {
    return next(err);
  }

  if (!decodedToken) {
    return next(Errors.User.userNotAuthenticated);
  }

  const { uid } = decodedToken;

  const { eventId } = req.params;

  if (isNaN(parseInt(eventId))) {
    return next(Errors.Event.eventDoesntExist);
  }

  const isAuthorizedUser = await prisma.user.findFirst({
    where: {
      firebaseId: uid,
    },
  });

  const isOrganizer = await prisma.event.count({
    where: {
      id: parseInt(eventId),
      organizers: {
        some: {
          firebaseId: uid,
        },
      },
    },
  });

  if (
    (isAuthorizedUser &&
      isAuthorizedUser.firebaseId === process.env.ADMIN_ID!) ||
    isOrganizer
  ) {
    return next();
  } else {
    return next(Errors.Auth.userUnauthorized);
  }
};

export { validateUser, getAdmin, isAdmin, isOrganizerOrAdmin };
