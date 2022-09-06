import { Transaction } from "@prisma/client";

const transactionsResponse = (transactions: Transaction[], userId: string) => {
  return transactions.map((transaction) => ({
    ...transaction,
    amount: transaction.amount,
    createdAt: transaction.createdAt,
    description: transaction.description,
    reason: transaction.reason,
    id: transaction.id,
    eventId: transaction.eventId,
    type: transaction.fromUserId === parseInt(userId) ? "DEBIT" : "CREDIT",
  }));
};

export { transactionsResponse };
