import { updateAccountData } from "@/lib/api/sushi";
import { withSessionRoute } from "@/lib/iron/wrappers";
import prisma from "@/lib/prisma";
import { TransactionStatus, TransactionType } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { object, array, string, number, date } from "yup";

const schema = object({
    description: string().required(),
    amount: number().required(),
    status: string().required().oneOf(["PENDING", "CLEARED", "CANCELLED"]),
    accountId: string().required(),
    categoryId: string().required(),
    date: date().required()
})
const batchSchema = array().of(schema);

export async function POST(request: NextRequest): Promise<NextResponse> {
    const session = await withSessionRoute();
    if (session.user == null) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const data = await batchSchema.validate(await request.json());
        if (data == undefined || data.length == 0) {
            return NextResponse.json({ error: "Invalid data" }, { status: 400 });
        }

        const account = await prisma.account.findUnique({
            where: {
                id: data[0].accountId
            }
        })

        if (account == null) {
            return NextResponse.json({ error: "Account not found" }, { status: 404 });
        }

        // Create transaction
        const transaction = await prisma.transaction.createMany({
            data: data.map((item) => {
                return {
                    description: item.description,
                    amount: Math.abs(item.amount),
                    type: item.amount > 0 ? TransactionType.INCOME : TransactionType.EXPENSE,
                    status: item.status as TransactionStatus,
                    date: item.date,
                    accountId: item.accountId,
                    categoryId: item.categoryId,
                    userId: session.user!.id
                }
            })
        });

        await updateAccountData(request, account.id);
        return NextResponse.json(transaction, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error }, { status: 400 });
    }
}