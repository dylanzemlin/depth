import { updateAccountData } from "@/lib/api/sushi";
import { withSessionRoute } from "@/lib/iron/wrappers";
import prisma from "@/lib/prisma";
import { SubscriptionFrequency } from "@prisma/client";
import { DateTime } from "luxon";
import { NextRequest, NextResponse } from "next/server";
import { object, string, number, date } from "yup";

const schema = object({
    description: string().required(),
    amount: number().required(),
    frequency: string().required().oneOf([SubscriptionFrequency.DAILY, SubscriptionFrequency.WEEKLY, SubscriptionFrequency.BIWEEKLY, SubscriptionFrequency.MONTHLY, SubscriptionFrequency.YEARLY]),
    accountId: string().required(),
    categoryId: string().required(),
    startDate: date().required(),
    endDate: date().optional()
})

export async function PATCH(request: NextRequest, { params }: { params: { subscriptionID: string } }): Promise<NextResponse> {
    const session = await withSessionRoute();
    if (session.user == null) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (params.subscriptionID == null) {
        return NextResponse.json({ error: "Subscription ID is required" }, { status: 400 });
    }

    try {
        const { description, amount, frequency, accountId, categoryId, startDate, endDate } = await schema.validate(await request.json());

        // Check if it exists and belongs to the user
        const subscription = await prisma.subscription.findFirst({
            where: {
                id: params.subscriptionID,
                userId: session.user.id
            }
        });

        if (subscription == null) {
            return NextResponse.json({ error: "Subscription not found" }, { status: 404 });
        }

        // Update the subscription
        const updatedSubscription = await prisma.subscription.update({
            where: {
                id: params.subscriptionID
            },
            data: {
                description: description ?? subscription.description,
                amount: amount ?? subscription.amount,
                frequency: frequency ?? subscription.frequency,
                startDate: DateTime.fromJSDate(startDate ?? subscription.startDate).toJSDate(),
                endDate: endDate || subscription.endDate ? DateTime.fromJSDate(endDate ?? subscription.endDate ?? new Date()).toJSDate() : undefined,
                account: {
                    connect: {
                        id: accountId ?? subscription.accountId
                    }
                },
                category: {
                    connect: {
                        id: categoryId ?? subscription.categoryId
                    }
                }
            }
        });

        updateAccountData(request, subscription.accountId);
        return NextResponse.json(updatedSubscription, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error }, { status: 400 });
    }
}

export async function DELETE(request: NextRequest, { params }: { params: { subscriptionID: string } }): Promise<NextResponse> {
    const session = await withSessionRoute();
    if (session.user == null) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (params.subscriptionID == null) {
        return NextResponse.json({ error: "Subscription ID is required" }, { status: 400 });
    }

    try {
        // Check if it exists and belongs to the user
        const subscription = await prisma.subscription.findFirst({
            where: {
                id: params.subscriptionID,
                userId: session.user.id
            }
        });

        if (subscription == null) {
            return NextResponse.json({ error: "Subscription not found" }, { status: 404 });
        }

        // Find all transactions for the subscription and delete them
        await prisma.transaction.deleteMany({
            where: {
                subscriptionId: subscription.id
            }
        })

        // Delete the subscription
        await prisma.subscription.delete({
            where: {
                id: params.subscriptionID
            }
        });

        updateAccountData(request, subscription.accountId);
        return NextResponse.json({}, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error }, { status: 400 });
    }
}