/*
  Warnings:

  - Added the required column `goal` to the `Budget` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Budget" ADD COLUMN     "goal" DOUBLE PRECISION NOT NULL;
