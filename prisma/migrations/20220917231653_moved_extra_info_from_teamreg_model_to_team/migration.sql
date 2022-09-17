/*
  Warnings:

  - You are about to drop the column `extraInformation` on the `TeamRegistration` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Team" ADD COLUMN     "extraInformation" JSONB[];

-- AlterTable
ALTER TABLE "TeamRegistration" DROP COLUMN "extraInformation";
