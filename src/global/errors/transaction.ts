import * as Utils from "@utils";

const transactionUnauthenticated = Utils.Response.Error(
  "Transaction is unauthenticated."
);
const transactionFailed = Utils.Response.Error("Transaction failed.", 403);
const transactionInvalidAmount = Utils.Response.Error(
  "Invalid amount transaction.",
  400
);

export {
  transactionUnauthenticated,
  transactionFailed,
  transactionInvalidAmount,
};
