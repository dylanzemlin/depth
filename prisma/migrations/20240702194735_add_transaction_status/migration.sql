/*
  Warnings:

  - Added the required column `status` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('CLEARED', 'PENDING', 'CANCELLED');

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "status" "TransactionStatus" NOT NULL;
