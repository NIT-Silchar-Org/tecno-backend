import * as Constants from "@constants";
import * as Interfaces from "@interfaces";
import * as Success from "@success";
import * as Errors from "@errors";

import { SparkTshirt, TshirtSize } from "@prisma/client";
import { prisma } from "@utils/prisma";

const createTshirtRequest: Interfaces.Controller.Async = async (
  req,
  res,
  next
) => {
  const {
    address,
    email,
    hostelName,
    isNITS,
    mobileNumber,
    name,
    scholarId,
    transactionId,
    tshirtSize,
  } = req.body as SparkTshirt;

  const isNITSBool = isNITS === "yes";

//   NOTE: For the time being, I am removing the validations
//   if (
//     typeof email !== "string" ||
//     typeof name !== "string" ||
//     typeof isNITS !== "string" ||
//     typeof mobileNumber !== "string" ||
//     typeof transactionId !== "string" ||
//     !Object.values(TshirtSize).includes(tshirtSize)
//   ) {
//     return next(Errors.Spark.invalidInput);
//   }

//   if (
//     (!name && !name.trim().length) ||
//     (!mobileNumber &&
//       !Constants.Spark.EMAIL_REGEX.test(mobileNumber.replace(/\s/g, ""))) ||
//     !!hostelName !== isNITSBool ||
//     !!scholarId !== isNITSBool ||
//     !!address === isNITSBool ||
//     !transactionId ||
//     !tshirtSize ||
//     !email
//   ) {
//     return next(Errors.Spark.invalidInput);
//   }

  const sparkTShirtForm = await prisma.sparkTshirt.findFirst({
    where: {
      OR: [{ email }, { mobileNumber }, { transactionId }],
    },
  });

  if (sparkTShirtForm) {
    return next(Errors.Spark.duplicateKey);
  }

  await prisma.sparkTshirt.create({
    data: {
      email,
      isNITS,
      mobileNumber,
      name,
      paymentReceipt: (req.file as Express.MulterS3.File).location,
      transactionId,
      tshirtSize,
      address,
      hostelName,
      scholarId,
    },
  });

  return res.json(Success.Spark.formSuccessfullySubmitted);
};

export { createTshirtRequest };
