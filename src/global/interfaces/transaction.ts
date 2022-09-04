interface CreateAttendanceTransactionBody {
  toUserId: string;
  eventId: string;
}

interface CreatePurchaseTransactionBody {
  toUserId: string;
  amount: number;
}

interface CreateOnlineEventTransaction {
  toUserId: string;
  amount: number;
}

interface TransactionBody {
  eventId: string;
}

export {
  CreatePurchaseTransactionBody,
  CreateAttendanceTransactionBody,
  CreateOnlineEventTransaction,
  TransactionBody,
};
