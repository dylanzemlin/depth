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

    const pageStr = request.nextUrl.searchParams.get("page");
    const page = pageStr ? parseInt(pageStr) : 0;
    const perPage = 25;

    const archived = request.nextUrl.searchParams.get("archived");

    try {
        const categories = await prisma.category.findMany({
            where: {
                userId: session.user.id,
                archived: archived == "none" ? undefined : archived === "true"
            },
            skip: page ? page * perPage : 0,
            take: perPage,
            orderBy: {
                createdAt: "desc"
            }
        })

        const totalCategories = await prisma.category.count({
            where: {
                userId: session.user.id,
                archived: archived == "none" ? undefined : archived === "true"
            }
        });

        return NextResponse.json({
            data: categories,
            pagination: {
                nextUrl: totalCategories > (page + 1) * perPage ? `${request.nextUrl.pathname}?page=${page + 1}` : null,
                prevUrl: page > 0 ? `${request.nextUrl.pathname}?page=${page - 1}` : null,
                total: totalCategories,
                current: page,
                pageSize: perPage
            }
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error }, { status: 400 });
    }
}