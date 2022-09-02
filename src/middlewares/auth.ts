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

const isAdmin: Interfaces.Middleware.Async = async (_req, _res, next) => {
  const admin = await prisma.user.findFirst({
    where: {
      firebaseId: process.env.ADMIN_ID!,
    },
  });

  if (admin) {
    next();
  } else {
    next(Errors.Auth.adminAuthError);
  }
};

const isUserAdmin: Interfaces.Middleware.Async = async (req, _res, next) => {
  const { toAdminId } =
    req.body as Interfaces.Transaction.CreatePurchaseTransactionBody;

  const admin = await prisma.user.findFirst({
    where: {
      firebaseId: toAdminId,
    },
  });

  if (
    admin &&
    toAdminId &&
    toAdminId.length &&
    toAdminId === process.env.ADMIN_ID!
  ) {
    next();
  } else {
    next(Errors.Auth.adminAuthError);
  }
};

export { validateUser, getAdmin, isUserAdmin, isAdmin };
