import { updateAccountData } from "@/lib/api/sushi";
import { withSessionRoute } from "@/lib/iron/wrappers";
import prisma from "@/lib/prisma";
import { TransactionType, TransferStatus } from "@prisma/client";
import dayjs from "dayjs";
import { NextRequest, NextResponse } from "next/server";
import { object, string, number, date } from "yup";
import { createTransferTransactions } from "../shared";

const schema = object({
    description: string().optional(),
    amount: number().optional(),
    status: string().optional().oneOf(["PENDING", "CLEARED", "CANCELLED"]),
    fromAccountId: string().optional(),
    toAccountId: string().optional(),
    categoryId: string().optional(),
    date: date().optional()
})

export async function PATCH(request: NextRequest, { params }: { params: { transferID: string } }): Promise<NextResponse> {
    const session = await withSessionRoute();
    if (session.user == null) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (params.transferID == null) {
        return NextResponse.json({ error: "Transfer ID is required" }, { status: 400 });
    }

    try {
        let { description, amount, fromAccountId, toAccountId, categoryId, date, status } = await schema.validate(await request.json());

        // Check if it exists and belongs to the user
        const transfer = await prisma.transfer.findFirst({
            where: {
                id: params.transferID,
                userId: session.user.id
            }
        });

        if (transfer == null) {
            return NextResponse.json({ error: "Transfer not found" }, { status: 404 });
        }

        // Determine if either accounts is being updated
        if ((fromAccountId != null && fromAccountId != transfer.fromAccountId) || (toAccountId != null && toAccountId != transfer.toAccountId)) {
            // Delete the old transactions
            await prisma.transaction.deleteMany({
                where: {
                    id: {
                        in: [transfer.fromAccountTransactionId, transfer.toAccountTransactionId]
                    }
                }
            });

            // Create transactions
            const { error, toAccountTransaction, fromAccountTransaction } = await createTransferTransactions({
                toAccountId: toAccountId ?? transfer.toAccountId,
                fromAccountId: fromAccountId ?? transfer.fromAccountId,
                categoryId: categoryId ?? transfer.categoryId,
                date: dayjs(date ?? transfer.date).hour(12).minute(0).second(0).toDate(),
                amount: amount ?? transfer.amount,
                description: description ?? transfer.description,
                status: status ?? transfer.status,
                userId: session.user.id
            })

            if (error != null || toAccountTransaction == null || fromAccountTransaction == null) {
                return NextResponse.json({ error: error ?? "Error creating transfer transactions" }, { status: 400 });
            }

            toAccountId = toAccountTransaction.accountId;
            fromAccountId = fromAccountTransaction.accountId;
        }

        // Update the transfer
        const updatedTransaction = await prisma.transfer.update({
            where: {
                id: params.transferID
            },
            data: {
                description: description ?? transfer.description,
                amount: amount ?? transfer.amount,
                fromAccountId: fromAccountId ?? transfer.fromAccountId,
                toAccountId: toAccountId ?? transfer.toAccountId,
                categoryId: categoryId ?? transfer.categoryId,
                date: dayjs(date ?? transfer.date).hour(12).minute(0).second(0).toDate(),
                status: status ? status as TransferStatus : transfer.status
            }
        });

        // Update the transactions if the amount, date, or status changed
        if ((amount != null && amount != transfer.amount) || (date != null && date != transfer.date) || (status != null && status != transfer.status)) {
            await prisma.transaction.updateMany({
                where: {
                    id: {
                        in: [updatedTransaction.fromAccountTransactionId, updatedTransaction.toAccountTransactionId]
                    }
                },
                data: {
                    amount: amount ?? updatedTransaction.amount,
                    date: dayjs(date ?? updatedTransaction.date).hour(12).minute(0).second(0).toDate(),
                    status: status ? status as TransferStatus : updatedTransaction.status
                }
            });
        }

        updateAccountData(request);
        return NextResponse.json(updatedTransaction, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error }, { status: 400 });
    }
}

export async function DELETE(request: NextRequest, { params }: { params: { transferID: string } }): Promise<NextResponse> {
    const session = await withSessionRoute();
    if (session.user == null) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (params.transferID == null) {
        return NextResponse.json({ error: "Transfer ID is required" }, { status: 400 });
    }

    try {
        // Check if it exists and belongs to the user
        const transfer = await prisma.transfer.findFirst({
            where: {
                id: params.transferID,
                userId: session.user.id
            }
        });

        if (transfer == null) {
            return NextResponse.json({ error: "Transfer not found" }, { status: 404 });
        }

        // Delete the transfer
        await prisma.transfer.delete({
            where: {
                id: params.transferID
            }
        });

        // Delete the transactions
        await prisma.transaction.deleteMany({
            where: {
                id: {
                    in: [transfer.fromAccountTransactionId, transfer.toAccountTransactionId]
                }
            }
        });

        return NextResponse.json({}, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error }, { status: 400 });
    }
}