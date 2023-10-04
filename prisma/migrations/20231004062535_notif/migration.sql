/*
  Warnings:

  - Added the required column `to_user` to the `notification` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "notification" ADD COLUMN     "to_user" TEXT NOT NULL;
