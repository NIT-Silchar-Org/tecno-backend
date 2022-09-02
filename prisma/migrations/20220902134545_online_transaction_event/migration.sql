/*
  Warnings:

  - Added the required column `description` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "TransactionReason" ADD VALUE 'ONLINE_EVENT';

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "description" TEXT NOT NULL,
ALTER COLUMN "eventId" DROP NOT NULL;
