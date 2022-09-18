import * as Interfaces from "@interfaces";
import * as Success from "@success";
import * as Utils from "@utils";
import * as Errors from "@errors";

import { prisma } from "@utils/prisma";

const updateUserDetails: Interfaces.Controller.Async = async (
  req,
  res,
  next
) => {
  const {
    firstName,
    lastName,
    middleName,
    collegeName,
    registrationId,
    phoneNumber,
    imageUrl,
  } = req.body as Interfaces.User.UserUpdateBody;

  const user = req?.user;

  if (phoneNumber && !Utils.User.validatePhoneNumber(phoneNumber)) {
    return next(Errors.User.notAcceptable("Phone number not acceptable"));
  }

  const updatedUser = await prisma.user.update({
    where: {
      firebaseId: req?.user?.firebaseId,
    },
    data: {
      firstName: firstName || user!.firstName,
      lastName: lastName || user!.lastName,
      middleName: middleName === "" ? "" : middleName || user!.middleName,
      collegeName: collegeName || user!.collegeName,
      registrationId: registrationId || user!.registrationId,
      phoneNumber: phoneNumber || user!.phoneNumber,
      balance: req?.body?.balance || user!.balance,
      imageUrl: imageUrl || user!.imageUrl,
    },
  });

  res.json(Success.User.updateUserResponse(updatedUser));
};

export { updateUserDetails };
