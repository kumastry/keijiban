/*
  Warnings:

  - Added the required column `boardId` to the `Like` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Like" ADD COLUMN     "boardId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "Board"("id") ON DELETE CASCADE ON UPDATE CASCADE;
