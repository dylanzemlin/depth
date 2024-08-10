import prisma from "@/lib/prisma";
import { TransactionStatus, TransactionType } from "@prisma/client";
import dayjs from "dayjs";
import { NextRequest, NextResponse } from "next/server";
import { DateTime, DurationLike } from "luxon";

const areApproxEqual = (a: number, b: number, epsilon = 0.0001) => Math.abs(a - b) < epsilon;

export async function GET(request: NextRequest): Promise<NextResponse> {
    if (process.env.NODE_ENV !== "development") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    return POST(request);
}

export async function POST(request: NextRequest): Promise<NextResponse> {
    const secret = request.headers.get("Authorization")?.replace("Bearer ", "");
    if (secret !== process.env.SUSHI_SECRET && process.env.NODE_ENV !== "development") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const start = Date.now();
    const updates: any[] = [];

    const accounts = await prisma.account.findMany({
        where: request.nextUrl.searchParams.has("target_account") ? {
            id: request.nextUrl.searchParams.get("target_account") as string
        } : {},
        include: {
            user: true
        }
    });
    const effectedUsers = new Set<string>();

    // Loop through all accounts and update their balance
    for (const account of accounts) {
        if (!effectedUsers.has(account.userId)) {
            const subUpdates = await handleSubscriptions(account.userId, account.user.timezone);
            updates.push(...subUpdates);
        }
        
        const userTz = account.user.timezone;
        
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
            const date = DateTime.fromJSDate(transaction.date).setZone(userTz);
            const now = DateTime.local().setZone(userTz);

            // Check if the transaction is in the future, but it can be the same day
            if (date > now) {
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

        if (areApproxEqual(balance, account.balance) && areApproxEqual(pendingBalance, account.pendingBalance)) {
            continue;
        }

        // Update the account balance
        updates.push({
            type: "UPDATE",
            entity: {
                type: "ACCOUNT",
                id: account.id,
                name: account.name
            },
            reason: "BALANCE_MISMATCH",
            details: {
                before: {
                    balance: account.balance,
                    pendingBalance: account.pendingBalance
                },
                after: {
                    balance,
                    pendingBalance
                },
            }
        });
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
            },
            include: {
                user: true
            }
        });
        if (transactions.length === 0 && !areApproxEqual(budget.amount, 0))
        {
            await prisma.budget.update({
                where: {
                    id: budget.id
                },
                data: {
                    amount: 0
                }
            });
            continue;
        }

        const userTz = transactions[0].user.timezone;
        let total = 0;
        for (const transaction of transactions) {
            const date = DateTime.fromJSDate(transaction.date).setZone(userTz);
            const now = DateTime.local().setZone(userTz);

            // Check if the transaction is in the current month
            if (date.month !== now.month || date.year !== now.year) {
                continue;
            }

            if (transaction.status !== TransactionStatus.CLEARED) {
                continue;
            }

            const sign = transaction.type === TransactionType.INCOME ? -1 : 1;
            total += sign * transaction.amount;
        }

        if (areApproxEqual(total, 0) && areApproxEqual(budget.amount, 0)) {
            continue;
        }

        if (total < 0) {
            total = 0;
        }

        updates.push({
            type: "UPDATE",
            entity: {
                type: "BUDGET",
                id: budget.id,
                name: budget.description,
                category: budget.categoryId
            },
            reason: "AMOUNT_MISMATCH",
            details: {
                before: budget.amount,
                after: total
            }
        });

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
        elapsed,
        updates
    });
}

async function handleSubscriptions(userId: string, userTz: string): Promise<any[]> {
    const subscriptions = await prisma.subscription.findMany({ where: { userId } });
    const updates: any[] = [];

    for (const subscription of subscriptions) {
        const start = DateTime.fromJSDate(subscription.startDate).setZone(userTz);
        const end = subscription.endDate ? (DateTime.fromJSDate(subscription.endDate).setZone(userTz) > DateTime.local().setZone(userTz) ? DateTime.local().setZone(userTz) : DateTime.fromJSDate(subscription.endDate)) : DateTime.local().setZone(userTz);
        const frequency = subscription.frequency;

        // Start from the subscription start date and loop ahead until the end date. Following the frquency, check if a transaction should be created
        let date = start;
        while (date < end || (date.hasSame(end, "day") && date.hasSame(end, "month") && date.hasSame(end, "year"))) {
            const manipulateDuration: DurationLike =
                frequency === "DAILY" ? { days: 1 } :
                    frequency == "WEEKLY" ? { weeks: 1 } :
                        frequency == "BIWEEKLY" ? { weeks: 2 } :
                            frequency == "MONTHLY" ? { months: 1 } :
                                frequency == "YEARLY" ? { years: 1 } : { days: 1 };

            // Check if there a transaction for the current date
            const transaction = await prisma.transaction.findFirst({
                where: {
                    subscriptionId: subscription.id,
                    date: date.toJSDate()
                }
            });

            // If there is no transaction, create one
            if (!transaction) {
                updates.push({
                    type: "CREATE",
                    entity: "TRANSCRIPTION",
                    reason: "SUBSCRIPTION",
                    details: {
                        amount: subscription.amount,
                        date: date.toJSDate(),
                    }
                });
                await prisma.transaction.create({
                    data: {
                        amount: subscription.amount,
                        date: date.toJSDate(),
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

            date = date.plus(manipulateDuration);
        }
    }

    return updates;
}