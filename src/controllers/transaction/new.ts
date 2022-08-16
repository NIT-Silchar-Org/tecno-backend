import { prisma } from "@utils/prisma";

import * as Interfaces from "@interfaces";
import * as Success from "@success";
import * as Errors from "@errors";
import { TransactionReason } from "@prisma/client";

const createNewAttendanceTransaction: Interfaces.Controller.Async = async (
  req,
  res,
  next
) => {
  const { eventId } = req.params;

  const { toUserId } =
    req.body as Interfaces.Transaction.CreateAttendanceTransactionBody;

  const toUser = await prisma.user.findFirst({
    where: {
      id: parseInt(toUserId),
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

    // Permission class add
    // Money deduct from admin but API accessible to manager

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
            id: req.user!.id,
          },
        },
        to: {
          connect: {
            id: toUser.id,
          },
        },
      },
    });

    const adminUpdate = prisma.user.update({
      where: {
        id: req.user!.id,
      },
      data: {
        balance: req.user!.balance - amount,
      },
    });

    const toUserUpdate = prisma.user.update({
      where: {
        id: toUser.id,
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
            id: req.user!.id,
          },
        },
        to: {
          connect: {
            id: toUser.id,
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
  const { eventId } = req.params;

  const { amount, toAdminId } =
    req.body as Interfaces.Transaction.CreatePurchaseTransactionBody;

  const admin = await prisma.user.findFirst({
    where: {
      id: parseInt(toAdminId),
    },
  });

  const event = await prisma.event.findFirst({
    where: { id: parseInt(eventId) },
  });

  if (!admin || !event) {
    return next(Errors.Transaction.transactionFailed);
  }

  // TODO: Check if event is Shopping Bonanza

  // TODO: Check last transaction time and is less than an threshold then fail transaction

  if (amount < 0) {
    return next(Errors.Transaction.transactionInvalidAmount);
  }

  const transactionCreate = prisma.transaction.create({
    data: {
      amount,
      reason: "PURCHASE",
      event: {
        connect: {
          id: event.id,
        },
      },
      from: {
        connect: {
          id: req.user!.id,
        },
      },
      to: {
        connect: {
          id: admin.id,
        },
      },
    },
  });

  const userUpdate = prisma.user.update({
    where: {
      id: req.user!.id,
    },
    data: {
      balance: req.user!.balance - amount,
    },
  });

  const adminUpdate = prisma.user.update({
    where: {
      id: admin.id,
    },
    data: {
      balance: admin.balance + amount,
    },
  });

  await prisma.$transaction([transactionCreate, userUpdate, adminUpdate]);

  return res.json(Success.Transaction.transactionComplete);
};

export { createNewAttendanceTransaction, createNewPurchaseTransaction };
