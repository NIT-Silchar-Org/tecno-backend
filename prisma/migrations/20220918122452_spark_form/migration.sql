-- CreateEnum
CREATE TYPE "TshirtSize" AS ENUM ('XS', 'S', 'M', 'L', 'XL', 'XXL');

-- CreateTable
CREATE TABLE "SparkTshirt" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "scholarId" TEXT,
    "isNITS" BOOLEAN NOT NULL,
    "mobileNumber" TEXT NOT NULL,
    "hostelNumber" TEXT,
    "address" TEXT,
    "tshirtSize" "TshirtSize" NOT NULL,
    "paymentReceipt" TEXT NOT NULL,
    "transactionId" INTEGER NOT NULL,

    CONSTRAINT "SparkTshirt_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SparkTshirt_transactionId_key" ON "SparkTshirt"("transactionId");
