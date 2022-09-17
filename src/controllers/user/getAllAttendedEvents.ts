import { prisma } from "@utils/prisma";

import * as Interfaces from "@interfaces";
import * as Utils from "@utils";
import { TransactionReason } from "@prisma/client";

const getAllAttendedEventsOfUser: Interfaces.Controller.Async = async (
  req,
  res
) => {
  const transactions = await prisma.transaction.findMany({
    where: {
      to: {
        firebaseId: req.user!.firebaseId,
      },
      reason: TransactionReason.ATTENDANCE,
    },
    select: {
      id: true,
      amount: true,
      description: true,
      reason: true,
      createdAt: true,
      event: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return res.json(Utils.Response.Success(transactions));
};

export { getAllAttendedEventsOfUser };
