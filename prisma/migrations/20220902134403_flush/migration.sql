/*
  Warnings:

  - You are about to drop the column `image` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `Module` table. All the data in the column will be lost.
  - Added the required column `posterImage` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `coverImage` to the `Module` table without a default value. This is not possible if the table is not empty.
  - Added the required column `iconImage` to the `Module` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Event" DROP COLUMN "image",
ADD COLUMN     "posterImage" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Module" DROP COLUMN "image",
ADD COLUMN     "coverImage" TEXT NOT NULL,
ADD COLUMN     "iconImage" TEXT NOT NULL;
