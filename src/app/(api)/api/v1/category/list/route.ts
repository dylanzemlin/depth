import { withSessionRoute } from "@/lib/iron/wrappers";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest): Promise<NextResponse>
{
    const session = await withSessionRoute();
    if (session.user == null)
    {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const page = request.nextUrl.searchParams.get("page") ?? "0";
    const pageAsNumber = parseInt(page, 10);

    try {
        const categories = await prisma.category.findMany({
            where: {
                userId: session.user.id,
            },
            skip: pageAsNumber * 25,
            take: 25
        })

        return NextResponse.json(categories, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error }, { status: 400 });
    }
}