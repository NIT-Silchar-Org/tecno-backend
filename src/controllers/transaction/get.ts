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
  const transactions = await prisma.transaction.findMany({
    where: {
      OR: [
        {
          fromUserId: parseInt(req.user!.firebaseId),
        },
        {
          toUserId: parseInt(req.user!.firebaseId),
        },
      ],
    },
  });

  return res.json(
    Utils.Response.Success(
      Utils.Transaction.transactionsResponse(transactions, req.user!.firebaseId)
    )
  );
};

export { getAllTransactions, getAllTransactionsForAUser };
