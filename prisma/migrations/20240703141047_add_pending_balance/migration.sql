/*
  Warnings:

  - Added the required column `pendingBalance` to the `Account` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Account" ADD COLUMN     "pendingBalance" DOUBLE PRECISION NOT NULL;
