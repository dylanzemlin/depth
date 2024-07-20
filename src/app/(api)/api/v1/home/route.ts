import utcDate from "@/lib/date";
import { withSessionRoute } from "@/lib/iron/wrappers";
import prisma from "@/lib/prisma";
import { Account, TransactionType } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest): Promise<NextResponse>
{
    const session = await withSessionRoute();
    if (session.user == null)
    {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const accounts = await prisma.account.findMany({
        where: {
            userId: session.user.id
        }
    });

    // Get total balance
    const totalBalance = accounts.reduce((acc: number, account: Account) => acc + account.balance, 0);

    // Calculate total income/expenses for this month
    // Find all transactions for the account for this month
    const now = utcDate();
    const transactions = await prisma.transaction.findMany({
        where: {
            userId: session.user.id,
            date: {
                gte: new Date(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0),
                lt: new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 23, 59, 59)
            }
        },
        orderBy: {
            date: "asc"
        },
        include: {
            transfersFrom: true,
            transfersTo: true
        }
    });

    const pureTransactions = transactions.filter(x => x.transfersFrom.length == 0 && x.transfersTo.length == 0);
    const income = pureTransactions.filter(t => t.type == TransactionType.INCOME).reduce((acc, t) => acc + t.amount, 0);
    const expenses = pureTransactions.filter(t => t.type == TransactionType.EXPENSE).reduce((acc, t) => acc + t.amount, 0);
    const incomeMapByDay = pureTransactions.filter(t => t.type == TransactionType.INCOME).reduce((acc, t) => {
        const date = new Date(t.date).getUTCDate();
        acc[date] = (acc[date] || 0) + t.amount;
        return acc;
    }, {} as Record<number, number>);
    const expenseMapByDay = pureTransactions.filter(t => t.type == TransactionType.EXPENSE).reduce((acc, t) => {
        const date = new Date(t.date).getUTCDate();
        acc[date] = (acc[date] || 0) + t.amount;
        return acc;
    }, {} as Record<number, number>);

    return NextResponse.json({
        totalBalance,
        income,
        expenses,
        incomeMapByDay,
        expenseMapByDay,
        pureTransactions
    });
}