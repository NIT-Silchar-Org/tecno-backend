import { prisma } from "@utils/prisma";

import * as Constants from "@constants";
import * as Interfaces from "@interfaces";
import * as Success from "@success";
import * as Errors from "@errors";
import { TransactionReason } from "@prisma/client";

const createNewAttendanceTransaction: Interfaces.Controller.Async = async (
  req,
  res,
  next
) => {
  const { toUserId, eventId } =
    req.body as Interfaces.Transaction.CreateAttendanceTransactionBody;

  const toUser = await prisma.user.findFirst({
    where: {
      firebaseId: toUserId,
    },
  });

  const event = await prisma.event.findFirst({
    where: { id: parseInt(eventId) },
  });

  if (!toUser || !event) {
    return next(Errors.Transaction.transactionFailed);
  }

  if (event.isIncentivised) {
    const amount = event.incentive!;

    const transactionCreate = prisma.transaction.create({
      data: {
        amount,
        reason: TransactionReason.ATTENDANCE,
        event: {
          connect: {
            id: event.id,
          },
        },
        from: {
          connect: {
            firebaseId: req.admin!.firebaseId,
          },
        },
        to: {
          connect: {
            firebaseId: toUser.firebaseId,
          },
        },
      },
    });

    const adminUpdate = prisma.user.update({
      where: {
        firebaseId: req.admin!.firebaseId,
      },
      data: {
        balance: req.admin!.balance - amount,
      },
    });

    const toUserUpdate = prisma.user.update({
      where: {
        firebaseId: toUser.firebaseId,
      },
      data: {
        balance: toUser.balance + amount,
      },
    });

    await prisma.$transaction([transactionCreate, adminUpdate, toUserUpdate]);
  } else {
    await prisma.transaction.create({
      data: {
        amount: 0,
        reason: TransactionReason.ATTENDANCE,
        event: {
          connect: {
            id: event.id,
          },
        },
        from: {
          connect: {
            firebaseId: req.admin!.firebaseId,
          },
        },
        to: {
          connect: {
            firebaseId: toUser.firebaseId,
          },
        },
      },
    });
  }

  return res.json(Success.Transaction.transactionComplete);
};

const createNewPurchaseTransaction: Interfaces.Controller.Async = async (
  req,
  res,
  next
) => {
  const { amount, toAdminId, eventId } =
    req.body as Interfaces.Transaction.CreatePurchaseTransactionBody;

  const admin = await prisma.user.findFirst({
    where: {
      firebaseId: toAdminId,
    },
  });

  const event = await prisma.event.findFirst({
    where: { id: parseInt(eventId) },
  });

  if (!admin || !event) {
    return next(Errors.Transaction.transactionFailed);
  }

  // TODO: Check last transaction time and is less than an threshold then fail transaction

  const transaction = await prisma.transaction.findFirst({
    where: {
      from: {
        firebaseId: req.user!.firebaseId,
      },
    },
    orderBy: { createdAt: "desc" },
  });

  if (transaction) {
    if (
      new Date(transaction.createdAt).getTime() - new Date().getTime() <
      Constants.Transaction.TRANSACTION_COOLDOWN
    ) {
      return next(Errors.Transaction.transactionTooQuick);
    }
  }

  if (amount < 0) {
    return next(Errors.Transaction.transactionInvalidAmount);
  }

  const transactionCreate = prisma.transaction.create({
    data: {
      amount,
      reason: TransactionReason.PURCHASE,
      event: {
        connect: {
          id: event.id,
        },
      },
      from: {
        connect: {
          firebaseId: req.user!.firebaseId,
        },
      },
      to: {
        connect: {
          firebaseId: admin.firebaseId,
        },
      },
    },
  });

  const userUpdate = prisma.user.update({
    where: {
      firebaseId: req.user!.firebaseId,
    },
    data: {
      balance: req.user!.balance - amount,
    },
  });

  const adminUpdate = prisma.user.update({
    where: {
      firebaseId: admin.firebaseId,
    },
    data: {
      balance: admin.balance + amount,
    },
  });

  await prisma.$transaction([transactionCreate, userUpdate, adminUpdate]);

  return res.json(Success.Transaction.transactionComplete);
};

export { createNewAttendanceTransaction, createNewPurchaseTransaction };
