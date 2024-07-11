import { withSessionRoute } from "@/lib/iron/wrappers";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest): Promise<NextResponse> {
    const session = await withSessionRoute();
    if (session.user == null) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const pageStr = request.nextUrl.searchParams.get("page");
    const pageSizeStr = request.nextUrl.searchParams.get("pageSize");
    const page = pageStr ? parseInt(pageStr) : 0;
    const perPage = pageSizeStr ? parseInt(pageSizeStr) : 5;

    const archived = request.nextUrl.searchParams.get("archived");

    try {
        const categories = await prisma.category.findMany({
            where: {
                userId: session.user.id,
                archived: archived == "none" ? undefined : archived === "true",
                OR: [
                    {
                        title: {
                            contains: request.nextUrl.searchParams.get("search") ?? "",
                            mode: "insensitive"
                        }
                    },
                    {

                        description: {
                            contains: request.nextUrl.searchParams.get("search") ?? "",
                            mode: "insensitive"
                        }
                    }
                ]
            },
            skip: page ? page * perPage : 0,
            take: perPage,
            orderBy: {
                title: "asc"
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