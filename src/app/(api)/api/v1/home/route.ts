import { withSessionRoute } from "@/lib/iron/wrappers";
import prisma from "@/lib/prisma";
import { Account, TransactionType } from "@prisma/client";
import { DateTime } from "luxon";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest): Promise<NextResponse> {
    const session = await withSessionRoute();
    if (session.user == null) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get Month/Year params from the request
    const userMonth = request.nextUrl.searchParams.get("month");
    const userYear = request.nextUrl.searchParams.get("year");

    let start: DateTime | null = null;
    let end: DateTime | null = null;
    const earliestTransaction = await prisma.transaction.findMany({
        where: {
            userId: session.user.id
        },
        orderBy: {
            date: "asc"
        },
        take: 1
    });

    if (userMonth != null && userYear != null) {
        // Parse when the month is in formation 1-12 and year is 4 digits
        const month = parseInt(userMonth);
        const year = parseInt(userYear);

        if (isNaN(month) || isNaN(year)) {
            // They want all time, so get the earliest tarnsaction
            if (earliestTransaction.length > 0) {
                start = DateTime.fromJSDate(earliestTransaction[0].date, { zone: "utc" });
                end = start.endOf("month");
            }
        } else {
            if (month >= 1 && month <= 12 && year >= 1000 && year <= 9999) {
                start = DateTime.fromObject({ year: year, month: month, day: 1 }, { zone: "utc" });
                end = start.endOf("month");
            }
        }
    }

    if (start == null || end == null) {
        start = DateTime.utc().startOf("month");
        end = start.endOf("month");
    }

    console.log(start);
    console.log(end);

    const accounts = await prisma.account.findMany({
        where: {
            userId: session.user.id
        }
    });

    // Get total balance
    let totalBalance = accounts.reduce((acc: number, account: Account) => acc + account.balance, 0);
    
    // TODO: Get all transactions after the "end" date and adjust the totalBalance
    const allTransactionsAfterEnd = await prisma.transaction.findMany({
        where: {
            userId: session.user.id,
            date: {
                gt: end.toJSDate()
            }
        }
    });

    // For all income transactions, remove it from the total balance
    const incomeTransactions = allTransactionsAfterEnd.filter(t => t.type == TransactionType.INCOME);
    totalBalance -= incomeTransactions.reduce((acc, t) => acc + t.amount, 0);

    // For all expense transactions, add it to the total balance
    const expenseTransactions = allTransactionsAfterEnd.filter(t => t.type == TransactionType.EXPENSE);
    totalBalance += expenseTransactions.reduce((acc, t) => acc + t.amount, 0);

    // Calculate total income/expenses for this month
    // Find all transactions for the account for this month
    const transactions = await prisma.transaction.findMany({
        where: {
            userId: session.user.id,
            date: {
                gte: start.toJSDate(),
                lte: end.toJSDate()
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
        pureTransactions,
        oldestYear: earliestTransaction.length > 0 ? earliestTransaction[0].date.getFullYear() : DateTime.local().year
    });
}