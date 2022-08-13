import * as Interfaces from "@interfaces";
import firebaseAdmin from "@utils/firebase";

import * as Errors from "@errors";
// import { prisma } from "@utils/prisma";

const validateUser: Interfaces.Controller.Async = async (req, _res, next) => {
  const auth: string | undefined = req?.headers?.authorization;

  if (!auth) {
    return next(Errors.Auth.userNotAuthenticated);
  }

  const idToken: string = (auth as string).split(" ")[1];

  const firebaseAuth = firebaseAdmin.auth();

  const parsedToken = await firebaseAuth.verifyIdToken(idToken);

  if (!parsedToken) {
    return next(Errors.Auth.userNotAuthenticated);
  }

  // const { uid } = parsedToken;

  // const user = await prisma.user.findFirst({
  //   where: {
  //     id: uid,
  //   },
  // });

  // if(!user){
  //   // TODO change error
  //   return next(Errors.Auth.userNotAuthenticated);
  // }

  return next();
};

export { validateUser };
