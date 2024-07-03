import { withSessionRoute } from "@/lib/iron/wrappers";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(): Promise<NextResponse>
{
    const session = await withSessionRoute();
    if (session.user == null)
    {
        return NextResponse.json({ error: "Not logged in" }, { status: 401 });
    }

    // Check if the user exists in the database
    const exists = (await prisma.user.count({
        where: {
            id: session.user.id
        }
    })) > 0;

    if (!exists)
    {
        session.destroy();
        return NextResponse.json({ error: "User not found" }, { status: 401 });
    }

    return NextResponse.json(session);
}