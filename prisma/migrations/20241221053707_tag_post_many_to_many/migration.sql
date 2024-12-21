/*
  Warnings:

  - You are about to drop the column `postId` on the `tag` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "tag" DROP CONSTRAINT "tag_postId_fkey";

-- AlterTable
ALTER TABLE "tag" DROP COLUMN "postId";

-- CreateTable
CREATE TABLE "tag_post" (
    "id" SERIAL NOT NULL,
    "tag_id" INTEGER NOT NULL,
    "post_id" TEXT NOT NULL,

    CONSTRAINT "tag_post_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "tag_post" ADD CONSTRAINT "tag_post_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tag_post" ADD CONSTRAINT "tag_post_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
