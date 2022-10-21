/*
  Warnings:

  - You are about to drop the column `verificationStatus` on the `TeamRegistration` table. All the data in the column will be lost.
  - You are about to drop the column `payeeId` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `payerId` on the `Transaction` table. All the data in the column will be lost.
  - Added the required column `lat` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lng` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `venue` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `registrationStatus` to the `Team` table without a default value. This is not possible if the table is not empty.
  - Added the required column `registrationStatus` to the `TeamRegistration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fromUserId` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `toUserId` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "RegistrationStatus" AS ENUM ('REGISTERED', 'PENDING', 'CANCELLED');

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_payeeId_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_payerId_fkey";

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "lat" TEXT NOT NULL,
ADD COLUMN     "lng" TEXT NOT NULL,
ADD COLUMN     "venue" TEXT NOT NULL,
ALTER COLUMN "prizeDescription" SET NOT NULL,
ALTER COLUMN "prizeDescription" SET DATA TYPE TEXT,
ALTER COLUMN "stagesDescription" SET NOT NULL,
ALTER COLUMN "stagesDescription" SET DATA TYPE TEXT,
ALTER COLUMN "description" SET NOT NULL,
ALTER COLUMN "description" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Team" ADD COLUMN     "registrationStatus" "RegistrationStatus" NOT NULL;

-- AlterTable
ALTER TABLE "TeamRegistration" DROP COLUMN "verificationStatus",
ADD COLUMN     "registrationStatus" "RegistrationStatus" NOT NULL;

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "payeeId",
DROP COLUMN "payerId",
ADD COLUMN     "fromUserId" INTEGER NOT NULL,
ADD COLUMN     "toUserId" INTEGER NOT NULL;

-- DropEnum
DROP TYPE "TeamMemberStatus";

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_fromUserId_fkey" FOREIGN KEY ("fromUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_toUserId_fkey" FOREIGN KEY ("toUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
