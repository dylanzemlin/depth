import { withSessionRoute } from "@/lib/iron/wrappers";
import prisma from "@/lib/prisma";
import { TransactionType } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { object, string, number, date } from "yup";

const schema = object({
    description: string().required(),
    amount: number().required(),
    type: string().required().oneOf(["income", "expense"]),
    status: string().required().oneOf(["pending", "cleared", "cancelled"]),
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
                type: type == "income" ? TransactionType.INCOME : TransactionType.EXPENSE,
                status: status == "pending" ? "PENDING" : status == "cleared" ? "CLEARED" : "CANCELLED",
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

        // Update account data as needed
        try {
            const url = request.nextUrl.clone();
            url.pathname = "/api/sushi/update";
            url.searchParams.set("target_account", accountId);
            await fetch(url.toString(), {
                headers: {
                    Authorization: `Bearer ${process.env.SUSHI_SECRET}`
                }
            });
        } catch (error) {
            console.error("Failed to update account balance", error);
        }

        return NextResponse.json(transaction, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error }, { status: 400 });
    }
}