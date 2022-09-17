-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "extraQuestions" JSONB[] DEFAULT ARRAY[]::JSONB[];

-- AlterTable
ALTER TABLE "TeamRegistration" ADD COLUMN     "extraInformation" JSONB[];
