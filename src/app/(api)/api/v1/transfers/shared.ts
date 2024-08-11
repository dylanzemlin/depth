import prisma from "@/lib/prisma"
import { Transaction, TransactionStatus, TransactionType } from "@prisma/client"
import { DateTime } from "luxon"

export async function createTransferTransactions({
    toAccountId,
    fromAccountId,
    categoryId,
    date,
    amount,
    description,
    status,
    userId
}: {
    toAccountId: string
    fromAccountId: string
    categoryId: string
    date: Date
    amount: number
    description: string
    status: string
    userId: string
}): Promise<{
    error?: string,
    toAccountTransaction?: Transaction,
    fromAccountTransaction?: Transaction
}> {
    // Check if the accounts exist
    const fromAccount = await prisma.account.findUnique({
        where: {
            id: fromAccountId,
            userId: userId
        }
    })

    if (fromAccount == null) {
        return { error: "From Account not found" }
    }

    const toAccount = await prisma.account.findUnique({
        where: {
            id: toAccountId,
            userId: userId
        }
    })

    if (toAccount == null) {
        return { error: "To Account not found" }
    }

    const category = await prisma.category.findUnique({
        where: {
            id: categoryId,
            userId: userId
        }
    })

    if (category == null) {
        return { error: "Category not found" }
}
    // Create from account transaction
    const fromAccountTransaction = await prisma.transaction.create({
        data: {
            accountId: fromAccountId,
            categoryId,
            userId: userId,
            date: DateTime.fromJSDate(date).toJSDate(),
            amount: amount,
            description,
            status: status as TransactionStatus,
            type: TransactionType.EXPENSE
        }
    })

    // Create to account transaction
    const toAccountTransaction = await prisma.transaction.create({
        data: {
            accountId: toAccountId,
            categoryId,
            userId: userId,
            date: DateTime.fromJSDate(date).toJSDate(),
            amount,
            description,
            status: status as TransactionStatus,
            type: TransactionType.INCOME
        }
    })

    return {
        fromAccountTransaction,
        toAccountTransaction
    }
}