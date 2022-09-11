/*
  Warnings:

  - You are about to drop the column `incentive` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `isIncentivised` on the `Event` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Event" DROP COLUMN "incentive",
DROP COLUMN "isIncentivised",
ADD COLUMN     "attendanceIncentive" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "registrationIncentive" INTEGER NOT NULL DEFAULT 0;
