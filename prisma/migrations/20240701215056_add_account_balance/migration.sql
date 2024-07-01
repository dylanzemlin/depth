/*
  Warnings:

  - Added the required column `balance` to the `Account` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Account` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Account" ADD COLUMN     "archived" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "balance" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL;
