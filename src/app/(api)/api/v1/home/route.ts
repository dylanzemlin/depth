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
                gte: new Date(now.getFullYear(), now.getMonth(), 1),
                lt: new Date(now.getFullYear(), now.getMonth() + 1, 1)
            }
        },
        orderBy: {
            date: "asc"
        }
    });

    const income = transactions.filter(t => t.type == TransactionType.INCOME).reduce((acc, t) => acc + t.amount, 0);
    const expenses = transactions.filter(t => t.type == TransactionType.EXPENSE).reduce((acc, t) => acc + t.amount, 0);
    const incomeMapByDay = transactions.filter(t => t.type == TransactionType.INCOME).reduce((acc, t) => {
        const date = new Date(t.date).getDate();
        acc[date] = (acc[date] || 0) + t.amount;
        return acc;
    }, {} as Record<number, number>);
    const expenseMapByDay = transactions.filter(t => t.type == TransactionType.EXPENSE).reduce((acc, t) => {
        const date = new Date(t.date).getDate();
        acc[date] = (acc[date] || 0) + t.amount;
        return acc;
    }, {} as Record<number, number>);

    return NextResponse.json({
        totalBalance,
        income,
        expenses,
        incomeMapByDay,
        expenseMapByDay
    });
}