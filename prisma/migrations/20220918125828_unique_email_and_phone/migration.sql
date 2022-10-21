/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `SparkTshirt` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[mobileNumber]` on the table `SparkTshirt` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "SparkTshirt_email_key" ON "SparkTshirt"("email");

-- CreateIndex
CREATE UNIQUE INDEX "SparkTshirt_mobileNumber_key" ON "SparkTshirt"("mobileNumber");
