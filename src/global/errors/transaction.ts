import * as Utils from "@utils";

const transactionUnauthenticated = Utils.Response.Error(
  "Transaction is unauthenticated.",
  401
);
const transactionFailed = Utils.Response.Error("Transaction failed.", 403);
const transactionInvalidAmount = Utils.Response.Error(
  "Invalid amount transaction.",
  400
);
const transactionTooQuick = Utils.Response.Error(
  "You have attempted your transaction too quick."
);

export {
  transactionUnauthenticated,
  transactionFailed,
  transactionInvalidAmount,
  transactionTooQuick,
};
