import { prisma } from "@utils/prisma";

import * as Interfaces from "@interfaces";
import * as Success from "@success";

const getAllTransactions: Interfaces.Controller.Async = async (_req, res) => {
  const transactions = await prisma.transaction.findMany({});

  res.json(Success.Transaction.getAllTransactionResponse(transactions));
};

export { getAllTransactions };
