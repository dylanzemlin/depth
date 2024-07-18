import prisma from "@/lib/prisma";
import dayjs from "dayjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest): Promise<NextResponse>
{
    const secret = request.headers.get("Authorization")?.replace("Bearer ", "");
    if (secret !== process.env.SUSHI_SECRET && process.env.NODE_ENV !== "development")
    {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Update all dates to be set at noon
    const transactions = await prisma.transaction.findMany();
    const currentTimeMs = Date.now();
    for (const transaction of transactions)
    {
        await prisma.transaction.update({
            where: {
                id: transaction.id
            },
            data: {
                date: dayjs(transaction.date).hour(12).minute(0).second(0).toDate()
            }
        });
    }
    const elapsed = Date.now() - currentTimeMs;

    return NextResponse.json({
        success: true,
        elapsed
    });
}