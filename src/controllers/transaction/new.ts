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
  try {
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
  } catch (err) {
    console.log(err);
    return next(Errors.Transaction.transactionFailed);
  }
};

const createNewOnlineEventTransaction: Interfaces.Controller.Async = async (
  req,
  res,
  next
) => {
  try {
    const { toUserId, amount } =
      req.body as Interfaces.Transaction.CreateOnlineEventTransaction;

    const toUser = await prisma.user.findFirst({
      where: {
        firebaseId: toUserId,
      },
    });

    if (amount < 0) {
      return next(Errors.Transaction.transactionInvalidAmount);
    }

    if (!toUser) {
      return next(Errors.Transaction.transactionFailed);
    }

    const transactionCreate = prisma.transaction.create({
      data: {
        amount,
        reason: TransactionReason.ONLINE_EVENT,
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

    return res.json(Success.Transaction.transactionComplete);
  } catch (err) {
    console.log(err);
    return next(Errors.Transaction.transactionFailed);
  }
};

const createNewPurchaseTransaction: Interfaces.Controller.Async = async (
  req,
  res,
  next
) => {
  try {
    const { amount, toUserId } =
      req.body as Interfaces.Transaction.CreatePurchaseTransactionBody;

    const admin = await prisma.user.findFirst({
      where: {
        firebaseId: toUserId,
      },
    });

    if (!admin) {
      return next(Errors.Transaction.transactionFailed);
    }

    if (req.user!.balance < amount) {
      return next(Errors.Transaction.insufficientBalance);
    }

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
        new Date().getTime() - new Date(transaction.createdAt).getTime() <
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
  } catch (err) {
    console.log(err);
    return next(Errors.Transaction.transactionFailed);
  }
};

export {
  createNewAttendanceTransaction,
  createNewPurchaseTransaction,
  createNewOnlineEventTransaction,
};
