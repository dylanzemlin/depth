import { withSessionRoute } from "@/lib/iron/wrappers";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: {  params: { accountID: string }}): Promise<NextResponse>
{
    const session = await withSessionRoute();
    if (session.user == null)
    {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (params.accountID == null)
    {
        return NextResponse.json({ error: "Account ID is required" }, { status: 400 });
    }

    try {
        // Check if it exists and belongs to the user
        const account = await prisma.account.findFirst({
            where: {
                id: params.accountID,
                userId: session.user.id
            }
        });

        if (account == null)
        {
            return NextResponse.json({ error: "Account not found" }, { status: 404 });
        }

        return NextResponse.json(account, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error }, { status: 400 });
    }
}