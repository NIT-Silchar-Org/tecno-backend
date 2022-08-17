import { prisma } from "@utils/prisma";

import * as Utils from "@utils";
import * as Interfaces from "@interfaces";
import * as Errors from "@errors";

const validateUser: Interfaces.Middleware.Async = async (req, _res, next) => {
  const auth: string | undefined = req?.headers?.authorization;

  if (!auth) {
    return next(Errors.User.badRequest);
  }

  const idToken: string = (auth as string).split(" ")[1];

  const firebaseAuth = Utils.Firebase.firebaseAdmin.auth();

  let decodedToken;
  try {
    decodedToken = await firebaseAuth.verifyIdToken(idToken);
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

export { validateUser };
