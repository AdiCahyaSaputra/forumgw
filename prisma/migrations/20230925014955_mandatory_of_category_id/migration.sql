/*
  Warnings:

  - Made the column `category_id` on table `post` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "post" DROP CONSTRAINT "post_category_id_fkey";

-- AlterTable
ALTER TABLE "post" ALTER COLUMN "category_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "post" ADD CONSTRAINT "post_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
