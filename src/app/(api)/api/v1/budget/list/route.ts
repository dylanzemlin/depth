import { withSessionRoute } from "@/lib/iron/wrappers";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

type QueryParams = {
    page?: number;
    category?: string;
    condition?: "is equal to" | "is between" | "is greater than" | "is less than";
    goal_1?: number;
    goal_2?: number;
    description?: string;
}

const tryParseQueryParams = (request: NextRequest): QueryParams => {
    const page = request.nextUrl.searchParams.get("page");
    const category = request.nextUrl.searchParams.get("category");
    const condition = request.nextUrl.searchParams.get("condition");
    const goal_1 = request.nextUrl.searchParams.get("cost_1");
    const goal_2 = request.nextUrl.searchParams.get("cost_2");
    const description = request.nextUrl.searchParams.get("description");

    return {
        page: page ? parseInt(page) : undefined,
        category: category ?? undefined,
        condition: condition as "is equal to" | "is between" | "is greater than" | "is less than",
        goal_1: goal_1 ? parseFloat(goal_1) : undefined,
        goal_2: goal_2 ? parseFloat(goal_2) : undefined,
        description: description ?? undefined
    }
}

const generatePrismaQuery = (params: QueryParams) => {
    const query = [];
    if (params.category) {
        query.push({
            categoryId: {
                equals: params.category
            }
        });
    }

    if (params.condition) {
        if (params.condition === "is equal to") {
            query.push({
                goal: {
                    equals: params.goal_1
                }
            });
        } else if (params.condition === "is between") {
            query.push({
                goal: {
                    gte: params.goal_1,
                    lte: params.goal_2
                }
            });
        } else if (params.condition === "is greater than") {
            query.push({
                goal: {
                    gt: params.goal_1
                }
            });
        } else if (params.condition === "is less than") {
            query.push({
                goal: {
                    lt: params.goal_1
                }
            });
        }
    }

    // if (params.description) {
    //     query.push({
    //         description: {
    //             contains: params.description,
    //             mode: "insensitive"
    //         }
    //     });
    // }

    return query;
}

export async function GET(request: NextRequest): Promise<NextResponse> {
    const session = await withSessionRoute();
    if (session.user == null) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const params = tryParseQueryParams(request);
    const page = params.page ?? 0;
    const perPage = 20;

    try {
        const budgets = await prisma.budget.findMany({
            where: {
                userId: session.user.id,
                AND: generatePrismaQuery(params),
            },
            skip: params.page ? params.page * perPage : 0,
            take: perPage,
            orderBy: {
                startDate: "desc"
            },
            include: {
                category: true
            }
        })

        const totalBudgets = await prisma.budget.count({
            where: {
                userId: session.user.id,
                AND: generatePrismaQuery(params)
            }
        });

        return NextResponse.json({
            data: budgets,
            pagination: {
                nextUrl: totalBudgets > (page + 1) * perPage ? `${request.nextUrl.pathname}?page=${page + 1}` : null,
                prevUrl: page > 0 ? `${request.nextUrl.pathname}?page=${page - 1}` : null,
                total: totalBudgets,
                current: page,
                pageSize: perPage
            }
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error }, { status: 400 });
    }
}