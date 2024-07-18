import { updateAccountData } from "@/lib/api/sushi";
import { withSessionRoute } from "@/lib/iron/wrappers";
import prisma from "@/lib/prisma";
import { TransactionType } from "@prisma/client";
import dayjs from "dayjs";
import { NextRequest, NextResponse } from "next/server";
import { object, string, number, date } from "yup";

const schema = object({
    description: string().optional(),
    amount: number().optional(),
    type: string().optional().oneOf(["INCOME", "EXPENSE"]),
    status: string().optional().oneOf(["PENDING", "CLEARED", "CANCELLED"]),
    accountId: string().optional(),
    categoryId: string().optional(),
    date: date().optional()
})

export async function PATCH(request: NextRequest, { params }: { params: { transactionID: string } }): Promise<NextResponse> {
    const session = await withSessionRoute();
    if (session.user == null) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (params.transactionID == null) {
        return NextResponse.json({ error: "Transaction ID is required" }, { status: 400 });
    }

    try {
        const { description, amount, type, accountId, categoryId, date, status } = await schema.validate(await request.json());

        // Check if it exists and belongs to the user
        const transaction = await prisma.transaction.findFirst({
            where: {
                id: params.transactionID,
                userId: session.user.id
            }
        });

        if (transaction == null) {
            return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
        }

        // Update the transaction
        const updatedTransaction = await prisma.transaction.update({
            where: {
                id: params.transactionID
            },
            data: {
                description: description ?? transaction.description,
                amount: amount ?? transaction.amount,
                type: (type ?? transaction.type) == "INCOME" ? TransactionType.INCOME : TransactionType.EXPENSE,
                status: (status ?? transaction.status) == "PENDING" ? "PENDING" : status == "CLEARED" ? "CLEARED" : "CANCELLED",
                date: dayjs(date ?? transaction.date).hour(12).minute(0).second(0).millisecond(0).toDate(),
                account: {
                    connect: {
                        id: accountId ?? transaction.accountId
                    }
                },
                category: {
                    connect: {
                        id: categoryId ?? transaction.categoryId
                    }
                }
            }
        });

        updateAccountData(request, transaction.accountId);
        return NextResponse.json(updatedTransaction, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error }, { status: 400 });
    }
}

export async function DELETE(request: NextRequest, { params }: { params: { transactionID: string } }): Promise<NextResponse> {
    const session = await withSessionRoute();
    if (session.user == null) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (params.transactionID == null) {
        return NextResponse.json({ error: "Transaction ID is required" }, { status: 400 });
    }

    try {
        // Check if it exists and belongs to the user
        const transaction = await prisma.transaction.findFirst({
            where: {
                id: params.transactionID,
                userId: session.user.id
            }
        });

        if (transaction == null) {
            return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
        }

        // Delete the transaction
        await prisma.transaction.delete({
            where: {
                id: params.transactionID
            }
        });

        updateAccountData(request, transaction.accountId);
        return NextResponse.json({}, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error }, { status: 400 });
    }
}