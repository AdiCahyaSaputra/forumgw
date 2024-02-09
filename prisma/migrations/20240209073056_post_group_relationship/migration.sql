/*
  Warnings:

  - You are about to drop the `group_post` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "group_post" DROP CONSTRAINT "group_post_group_id_fkey";

-- DropForeignKey
ALTER TABLE "group_post" DROP CONSTRAINT "group_post_post_id_fkey";

-- AlterTable
ALTER TABLE "post" ADD COLUMN     "group_id" TEXT;

-- DropTable
DROP TABLE "group_post";

-- AddForeignKey
ALTER TABLE "post" ADD CONSTRAINT "post_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "group"("id") ON DELETE CASCADE ON UPDATE CASCADE;
