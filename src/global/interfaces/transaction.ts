interface CreateAttendanceTransactionBody {
  toUserId: string;
}

interface CreatePurchaseTransactionBody {
  toAdminId: string;
  amount: number;
}

export { CreatePurchaseTransactionBody, CreateAttendanceTransactionBody };
