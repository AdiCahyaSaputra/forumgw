/*
  Warnings:

  - The required column `public_id` was added to the `group` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "group" ADD COLUMN     "public_id" TEXT NOT NULL;
