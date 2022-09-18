/*
  Warnings:

  - You are about to drop the column `hostelNumber` on the `SparkTshirt` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "SparkTshirt" DROP COLUMN "hostelNumber",
ADD COLUMN     "hostelName" TEXT,
ALTER COLUMN "isNITS" SET DATA TYPE TEXT;
