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

export async function POST(request: NextRequest): Promise<NextResponse>
{
    const session = await withSessionRoute();
    if (session.user == null)
    {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { description, amount, frequency, accountId, categoryId, startDate, endDate } = await schema.validate(await request.json());

        const account = await prisma.account.findUnique({
            where: {
                id: accountId
            }
        })

        if (account == null)
        {
            return NextResponse.json({ error: "Account not found" }, { status: 404 });
        }

        const category = await prisma.category.findUnique({
            where: {
                id: categoryId
            }
        })

        if (category == null)
        {
            return NextResponse.json({ error: "Category not found" }, { status: 404 });
        }

        // Create subscription
        const subscription = await prisma.subscription.create({
            data: {
                description,
                amount: Math.abs(amount),
                frequency: frequency as SubscriptionFrequency,
                startDate: DateTime.fromJSDate(startDate).toJSDate(),
                endDate: endDate != undefined ? DateTime.fromJSDate(endDate).toJSDate() : undefined,
                account: {
                    connect: {
                        id: accountId
                    }
                },
                category: {
                    connect: {
                        id: categoryId
                    }
                },
                user: {
                    connect: {
                        id: session.user.id
                    }
                }
            }
        })

        await updateAccountData(request, accountId);
        return NextResponse.json(subscription, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error }, { status: 400 });
    }
}