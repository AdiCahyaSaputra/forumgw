/*
  Warnings:

  - You are about to drop the column `commentId` on the `notification` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "notification" DROP CONSTRAINT "notification_commentId_fkey";

-- AlterTable
ALTER TABLE "notification" DROP COLUMN "commentId",
ADD COLUMN     "comment_id" INTEGER;

-- AddForeignKey
ALTER TABLE "notification" ADD CONSTRAINT "notification_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "comment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
