import { updateAccountData } from "@/lib/api/sushi";
import { withSessionRoute } from "@/lib/iron/wrappers";
import prisma from "@/lib/prisma";
import { TransactionStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { object, string, number, date } from "yup";
import { createTransferTransactions } from "./shared";
import { DateTime } from "luxon";

const schema = object({
    description: string().required(),
    amount: number().required(),
    status: string().required().oneOf(["PENDING", "CLEARED", "CANCELLED"]),
    fromAccountId: string().required(),
    toAccountId: string().required(),
    categoryId: string().required(),
    date: date().required()
})

export async function POST(request: NextRequest): Promise<NextResponse> {
    const session = await withSessionRoute();
    if (session.user == null) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { description, amount, categoryId, date, status, fromAccountId, toAccountId } = await schema.validate(await request.json());

        const fromAccount = await prisma.account.findUnique({
            where: {
                id: fromAccountId,
                userId: session.user.id
            }
        })

        if (fromAccount == null) {
            return NextResponse.json({ error: "From Account not found" }, { status: 404 });
        }

        const toAccount = await prisma.account.findUnique({
            where: {
                id: toAccountId,
                userId: session.user.id
            }
        })

        if (toAccount == null) {
            return NextResponse.json({ error: "To Account not found" }, { status: 404 });
        }

        const category = await prisma.category.findUnique({
            where: {
                id: categoryId,
                userId: session.user.id
            }
        })

        if (category == null) {
            return NextResponse.json({ error: "Category not found" }, { status: 404 });
        }

        // Create transactions
        const { error, toAccountTransaction, fromAccountTransaction } = await createTransferTransactions({
            toAccountId,
            fromAccountId,
            categoryId,
            date,
            amount,
            description,
            status,
            userId: session.user.id
        })

        if (error != null || toAccountTransaction == null || fromAccountTransaction == null) {
            return NextResponse.json({ error: error ?? "Error creating transfer transactions" }, { status: 400 });
        }

        // Create transfer
        const transfer = await prisma.transfer.create({
            data: {
                fromAccountId,
                toAccountId,
                categoryId,
                userId: session.user.id,
                date: DateTime.fromJSDate(date).toJSDate(),
                amount,
                description,
                status: status as TransactionStatus,
                toAccountTransactionId: toAccountTransaction.id,
                fromAccountTransactionId: fromAccountTransaction.id
            }
        })

        await updateAccountData(request); // TODO: Specify account ids
        return NextResponse.json(transfer, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error }, { status: 400 });
    }
}