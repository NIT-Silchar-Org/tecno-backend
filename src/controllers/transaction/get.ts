import { prisma } from "@utils/prisma";

import * as Interfaces from "@interfaces";
import * as Utils from "@utils";
import * as Success from "@success";
import { TransactionReason } from "@prisma/client";

const getAllTransactions: Interfaces.Controller.Async = async (_req, res) => {
  const transactions = await prisma.transaction.findMany({});

  res.json(Success.Transaction.getAllTransactionResponse(transactions));
};

const getAllTransactionsForAUser: Interfaces.Controller.Async = async (
  req,
  res
) => {
  const { userId } = req.params;

  const transactions = await prisma.transaction.findMany({
    where: {
      OR: [
        {
          fromUserId: parseInt(userId),
        },
        {
          toUserId: parseInt(userId),
        },
      ],
    },
  });

  return res.json(Utils.Transaction.transactionsResponse(transactions, userId));
};

const getAllAttendanceOfUser: Interfaces.Controller.Async = async (
  req,
  res
) => {
  const { userId } = req.params;

  const transactions = await prisma.transaction.findMany({
    where: {
      OR: [
        {
          to: {
            firebaseId: userId,
          },
        },
        {
          from: {
            firebaseId: userId,
          },
        },
      ],
      reason: TransactionReason.ATTENDANCE,
    },
    select: {
      id: true,
      fromUserId: true,
      toUserId: true,
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

export {
  getAllTransactions,
  getAllTransactionsForAUser,
  getAllAttendanceOfUser,
};
