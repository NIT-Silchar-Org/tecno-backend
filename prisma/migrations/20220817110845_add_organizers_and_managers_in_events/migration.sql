-- CreateTable
CREATE TABLE "_manager" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_organizer" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_manager_AB_unique" ON "_manager"("A", "B");

-- CreateIndex
CREATE INDEX "_manager_B_index" ON "_manager"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_organizer_AB_unique" ON "_organizer"("A", "B");

-- CreateIndex
CREATE INDEX "_organizer_B_index" ON "_organizer"("B");

-- AddForeignKey
ALTER TABLE "_manager" ADD CONSTRAINT "_manager_A_fkey" FOREIGN KEY ("A") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_manager" ADD CONSTRAINT "_manager_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_organizer" ADD CONSTRAINT "_organizer_A_fkey" FOREIGN KEY ("A") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_organizer" ADD CONSTRAINT "_organizer_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
