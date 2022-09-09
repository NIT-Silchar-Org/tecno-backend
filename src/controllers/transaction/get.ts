import { prisma } from "@utils/prisma";

import * as Interfaces from "@interfaces";
import * as Utils from "@utils";
import * as Success from "@success";

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

export { getAllTransactions, getAllTransactionsForAUser };
