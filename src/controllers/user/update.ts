import * as Interfaces from "@interfaces";
import * as Success from "@success";

import { prisma } from "@utils/prisma";

const updateUserDetails: Interfaces.Controller.Async = async (
  req,
  res,
  _next
) => {
  const { name, collegeName, registrationId, imageUrl } =
    req.body as Interfaces.User.UserUpdateBody;

  const user = req?.user;

  const updatedUser = await prisma.user.update({
    where: {
      firebaseId: req?.user?.firebaseId,
    },
    data: {
      name: name || user?.name,
      collegeName: collegeName || user?.collegeName,
      registrationId: registrationId || user?.registrationId,
      imageUrl: imageUrl || user?.imageUrl,
    },
  });

  res.json(Success.User.updateUserResponse(updatedUser));
};

export { updateUserDetails };
