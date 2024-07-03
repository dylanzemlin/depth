/*
  Warnings:

  - You are about to drop the `_BudgetToCategory` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `categoryId` to the `Budget` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_BudgetToCategory" DROP CONSTRAINT "_BudgetToCategory_A_fkey";

-- DropForeignKey
ALTER TABLE "_BudgetToCategory" DROP CONSTRAINT "_BudgetToCategory_B_fkey";

-- AlterTable
ALTER TABLE "Budget" ADD COLUMN     "categoryId" TEXT NOT NULL;

-- DropTable
DROP TABLE "_BudgetToCategory";

-- AddForeignKey
ALTER TABLE "Budget" ADD CONSTRAINT "Budget_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
