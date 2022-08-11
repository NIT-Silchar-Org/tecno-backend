import { Transaction } from "@prisma/client";
import * as Utils from "@utils";

const getAllTransactionResponse = (transactions: Transaction[]) =>
  Utils.Response.Success(transactions);

const transactionComplete = Utils.Response.Success(
  "Transaction completed successfully."
);

export { getAllTransactionResponse, transactionComplete };
