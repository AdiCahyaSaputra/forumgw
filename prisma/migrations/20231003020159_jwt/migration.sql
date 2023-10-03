/*
  Warnings:

  - Added the required column `expired_in` to the `jwt` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "jwt" ADD COLUMN     "expired_in" TIMESTAMP(3) NOT NULL;
