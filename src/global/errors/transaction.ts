import * as Utils from "@utils";

const transactionUnauthenticated = Utils.Response.Error(
  "Transaction is unauthenticated."
);
const transactionFailed = Utils.Response.Error("Transaction failed.");
const transactionInvalidAmount = Utils.Response.Error(
  "Invalid amount transaction."
);

export {
  transactionUnauthenticated,
  transactionFailed,
  transactionInvalidAmount,
};
