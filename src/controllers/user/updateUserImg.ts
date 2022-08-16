import * as Interfaces from "@interfaces";
import * as Errors from "@errors";
import * as Success from "@success";
import { prisma } from "@utils/prisma";

const updateUserImg: Interfaces.Controller.Async = async (req, res, next) => {
  const imageUrl: string = (req.body as Interfaces.User.UserImgUpdateBody)
    ?.imageUrl;

  if (!imageUrl) {
    return next(Errors.User.badRequest);
  }

  const updatedUser = await prisma.user.update({
    where: {
      firebaseId: req?.user?.firebaseId,
    },
    data: {
      imageUrl: imageUrl,
    },
  });

  res.json(Success.User.updateUserImgResponse(updatedUser));
};

export { updateUserImg };
