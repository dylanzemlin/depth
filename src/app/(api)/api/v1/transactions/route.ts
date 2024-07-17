import { updateAccountData } from "@/lib/api/sushi";
import { withSessionRoute } from "@/lib/iron/wrappers";
import prisma from "@/lib/prisma";
import { TransactionStatus, TransactionType } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { object, string, number, date } from "yup";

const schema = object({
    description: string().required(),
    amount: number().required(),
    type: string().required().oneOf(["INCOME", "EXPENSE"]),
    status: string().required().oneOf(["PENDING", "CLEARED", "CANCELLED"]),
    accountId: string().required(),
    categoryId: string().required(),
    date: date().required()
})

export async function POST(request: NextRequest): Promise<NextResponse>
{
    const session = await withSessionRoute();
    if (session.user == null)
    {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { description, amount, type, accountId, categoryId, date, status } = await schema.validate(await request.json());

        const account = await prisma.account.findUnique({
            where: {
                id: accountId
            }
        })

        if (account == null)
        {
            return NextResponse.json({ error: "Account not found" }, { status: 404 });
        }

        // Create transaction
        const transaction = await prisma.transaction.create({
            data: {
                description,
                amount: Math.abs(amount),
                type: type as TransactionType,
                status: status as TransactionStatus,
                date,
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
        return NextResponse.json(transaction, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error }, { status: 400 });
    }
}