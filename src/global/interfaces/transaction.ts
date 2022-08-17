interface CreateAttendanceTransactionBody {
  toUserId: string;
  eventId: string;
}

interface CreatePurchaseTransactionBody {
  toAdminId: string;
  amount: number;
  eventId: string;
}

export { CreatePurchaseTransactionBody, CreateAttendanceTransactionBody };
