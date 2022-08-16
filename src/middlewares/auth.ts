import * as Interfaces from "@interfaces";
import * as Utils from "@utils";

import * as Errors from "@errors";
import { prisma } from "@utils/prisma";

const validateUser: Interfaces.Controller.Async = async (req, _res, next) => {
  const auth: string | undefined = req?.headers?.authorization;

  if (!auth) {
    return next(Errors.User.badRequest);
  }

  const idToken: string = (auth as string).split(" ")[1];

  const firebaseAuth = Utils.Firebase.firebaseAdmin.auth();

  const decodedToken = await firebaseAuth.verifyIdToken(idToken);

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
