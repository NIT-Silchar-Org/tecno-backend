interface CreateAttendanceTransactionBody {
  toUserName: string;
  eventId: string;
}

interface CreatePurchaseTransactionBody {
  toUserName: string;
  amount: number;
}

interface CreateOnlineEventTransaction {
  toUserName: string;
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
