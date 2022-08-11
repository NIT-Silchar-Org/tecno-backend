-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_moduleId_fkey";

-- DropForeignKey
ALTER TABLE "TeamRegistration" DROP CONSTRAINT "TeamRegistration_teamId_fkey";

-- DropForeignKey
ALTER TABLE "TeamRegistration" DROP CONSTRAINT "TeamRegistration_userId_fkey";

-- AddForeignKey
ALTER TABLE "TeamRegistration" ADD CONSTRAINT "TeamRegistration_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamRegistration" ADD CONSTRAINT "TeamRegistration_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module"("id") ON DELETE CASCADE ON UPDATE CASCADE;
