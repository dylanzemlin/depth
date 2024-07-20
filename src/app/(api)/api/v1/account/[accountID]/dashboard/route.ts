import { withSessionRoute } from "@/lib/iron/wrappers";
import prisma from "@/lib/prisma";
import { TransactionType } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: {  params: { accountID: string }}): Promise<NextResponse>
{
    const session = await withSessionRoute();
    if (session.user == null)
    {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { accountID } = params;
    const account = await prisma.account.findUnique({
        where: {
            id: accountID,
            userId: session.user.id
        }
    })
    if (account == null)
    {
        return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    // Find all transactions for the account for this month
    const transactions = await prisma.transaction.findMany({
        where: {
            accountId: account.id,
            date: {
                gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1, 0, 0, 0),
                lt: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 23, 59, 59)
            }
        },
        orderBy: {
            date: "desc"
        },
        include: {
            category: true,
            transfersFrom: true,
            transfersTo: true
        }
    });

    const pureTransactions = transactions.filter(x => x.transfersFrom.length == 0 && x.transfersTo.length == 0);
    const income = pureTransactions.filter(t => t.type == TransactionType.INCOME).reduce((acc, t) => acc + t.amount, 0);
    const expenses = pureTransactions.filter(t => t.type == TransactionType.EXPENSE).reduce((acc, t) => acc + t.amount, 0);
    const incomeMapByDay = pureTransactions.filter(t => t.type == TransactionType.INCOME).reduce((acc, t) => {
        const date = new Date(t.date).getDate();
        acc[date] = (acc[date] || 0) + t.amount;
        return acc;
    }, {} as Record<number, number>);
    const expenseMapByDay = pureTransactions.filter(t => t.type == TransactionType.EXPENSE).reduce((acc, t) => {
        const date = new Date(t.date).getDate();
        acc[date] = (acc[date] || 0) + t.amount;
        return acc;
    }, {} as Record<number, number>);

    const recentTransactions = transactions.slice(0, 10);

    return NextResponse.json({
        income,
        expenses,
        incomeMapByDay,
        expenseMapByDay,
        recentTransactions
    });
}