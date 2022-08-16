import * as Interfaces from "@interfaces";
import * as Errors from "@errors";
import * as Success from "@success";
import * as Utils from "@utils";

import { prisma } from "@utils/prisma";

const signUp: Interfaces.Controller.Async = async (req, res, next) => {
  const auth: string | undefined = req?.headers?.authorization;

  const user: Interfaces.User.CreateUserBody = req.body;

  const { username, name, collegeName, registrationId, email, imageUrl } = user;

  if (!username || !name || !collegeName || !registrationId || !email) {
    return next(Errors.User.badRequest);
  }

  if (!auth) {
    return next(Errors.User.badRequest);
  }

  const idToken: string = (auth as string).split(" ")[1];

  const firebaseAuth = Utils.Firebase.firebaseAdmin.auth();

  const decodedToken = await firebaseAuth.verifyIdToken(idToken);

  if (!decodedToken) {
    return next(Errors.User.userNotAuthenticated);
  }

  const { uid, email: firebaseEmail, picture } = decodedToken;

  const userExists: number = await prisma.user.count({
    where: {
      OR: [
        {
          firebaseId: uid,
        },
        {
          email: firebaseEmail || email,
        },
        {
          username: username,
        },
      ],
    },
  });

  if (userExists) {
    return next(Errors.User.userAlreadyExists);
  }

  await prisma.user.create({
    data: {
      email: firebaseEmail || email,
      balance: 0,
      collegeName: collegeName,
      registrationId: registrationId,
      firebaseId: uid,
      name: name,
      imageUrl: imageUrl || picture || "https://picsum.photos/200",
      username: username,
    },
  });

  return res.json(Success.User.userCreated);
};

export { signUp };
