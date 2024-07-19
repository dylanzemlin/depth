import prisma from "@/lib/prisma";
import { TransactionStatus, TransactionType } from "@prisma/client";
import dayjs from "dayjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest): Promise<NextResponse> {
    const secret = request.headers.get("Authorization")?.replace("Bearer ", "");
    if (secret !== process.env.SUSHI_SECRET && process.env.NODE_ENV !== "development") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const start = Date.now();

    const accounts = await prisma.account.findMany({
        where: request.nextUrl.searchParams.has("target_account") ? {
            id: request.nextUrl.searchParams.get("target_account") as string
        } : {}
    });
    const effectedUsers = new Set<string>();

    // Loop through all accounts and update their balance
    for (const account of accounts) {
        if (!effectedUsers.has(account.userId)) {
            await handleSubscriptions(account.userId);
        }
        
        effectedUsers.add(account.userId);
        let balance = 0;
        let pendingBalance = 0;

        // Find all transactions for the account
        const transactions = await prisma.transaction.findMany({
            where: {
                accountId: account.id
            }
        });

        // Loop through all transactions and update the balance
        for (const transaction of transactions) {
            const date = dayjs(transaction.date);
            const now = dayjs();

            // Check if the transaction is in the future, but it can be the same day
            if (date.isAfter(now) && !date.isSame(now, "day")) {
                continue;
            }

            const sign = transaction.type === TransactionType.INCOME ? 1 : -1;
            if (transaction.status !== TransactionStatus.CLEARED) {
                pendingBalance += sign * transaction.amount;
                continue;
            }

            balance += sign * transaction.amount;
            pendingBalance += sign * transaction.amount;
        }

        // Update the account balance
        await prisma.account.update({
            where: {
                id: account.id
            },
            data: {
                balance,
                pendingBalance
            }
        });
    }

    const budgets = await prisma.budget.findMany({
        where: {
            userId: {
                in: Array.from(effectedUsers)
            }
        }
    });
    for (const budget of budgets) {
        const transactions = await prisma.transaction.findMany({
            where: {
                categoryId: budget.categoryId
            }
        });

        let total = 0;
        for (const transaction of transactions) {
            const date = dayjs(transaction.date);
            const now = dayjs();

            // Check if the transaction is in the current month
            if (!date.isSame(now, "month") || !date.isSame(now, "year")) {
                continue;
            }

            if (transaction.status !== TransactionStatus.CLEARED) {
                continue;
            }

            const sign = transaction.type === TransactionType.INCOME ? -1 : 1;
            total += sign * transaction.amount;
        }

        await prisma.budget.update({
            where: {
                id: budget.id
            },
            data: {
                amount: total
            }
        });
    }

    const elapsed = Date.now() - start;

    return NextResponse.json({
        success: true,
        elapsed
    });
}

async function handleSubscriptions(userId: string): Promise<void> {
    const subscriptions = await prisma.subscription.findMany({ where: { userId } });

    for (const subscription of subscriptions) {
        const start = dayjs(subscription.startDate);
        const end = subscription.endDate ? dayjs(subscription.endDate).isAfter(dayjs()) ? dayjs() : dayjs(subscription.endDate) : dayjs();
        const frequency = subscription.frequency;

        // Start from the subscription start date and loop ahead until the end date. Following the frquency, check if a transaction should be created
        let date = start;
        while (date.isBefore(end) || date.isSame(end, "day")) {
            const manipulateAmount = frequency == "BIWEEKLY" ? 2 : 1;
            const manipulateType: dayjs.ManipulateType =
                frequency === "DAILY" ? "day" :
                    frequency == "WEEKLY" ? "week" :
                        frequency == "BIWEEKLY" ? "week" :
                            frequency == "MONTHLY" ? "month" :
                                frequency == "YEARLY" ? "year" : "day";

            // Check if there a transaction for the current date
            const transaction = await prisma.transaction.findFirst({
                where: {
                    subscriptionId: subscription.id,
                    date: date.toDate()
                }
            });

            // If there is no transaction, create one
            if (!transaction) {
                await prisma.transaction.create({
                    data: {
                        amount: subscription.amount,
                        date: date.toDate(),
                        type: "EXPENSE",
                        status: TransactionStatus.CLEARED,
                        description: subscription.description,

                        subscriptionId: subscription.id,
                        userId: subscription.userId,
                        accountId: subscription.accountId,
                        categoryId: subscription.categoryId
                    }
                });
            }

            date = date.add(manipulateAmount, manipulateType);
        }
    }
}