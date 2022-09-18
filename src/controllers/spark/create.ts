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
    hostelNumber,
    isNITS,
    mobileNumber,
    name,
    paymentReceipt,
    scholarId,
    transactionId,
    tshirtSize,
  } = req.body as SparkTshirt;

  if (
    typeof email !== "string" ||
    typeof name !== "string" ||
    typeof isNITS !== "boolean" ||
    typeof mobileNumber !== "string" ||
    typeof paymentReceipt !== "string" ||
    typeof transactionId !== "string" ||
    !Object.values(TshirtSize).includes(tshirtSize)
  ) {
    return next(Errors.Spark.invalidInput);
  }

  if (
    (!name && !name.trim().length) ||
    (!mobileNumber &&
      !Constants.Spark.EMAIL_REGEX.test(mobileNumber.replace(/\s/g, ""))) ||
    !!hostelNumber !== isNITS ||
    !paymentReceipt ||
    !!scholarId !== isNITS ||
    !!address === isNITS ||
    !transactionId ||
    !tshirtSize ||
    !email
  ) {
    return next(Errors.Spark.invalidInput);
  }

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
      paymentReceipt,
      transactionId,
      tshirtSize,
      address,
      hostelNumber,
      scholarId,
    },
  });

  return res.json(Success.Spark.formSuccessfullySubmitted);
};

export { createTshirtRequest };
