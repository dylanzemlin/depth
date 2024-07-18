import { withSessionRoute } from "@/lib/iron/wrappers";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

type QueryParams = {
    page?: number;
    categoryId?: string;
    amountCondition?: "is equal to" | "is between" | "is greater than" | "is less than";
    minAmount?: number;
    maxAmount?: number;
    goalCondition?: "is equal to" | "is between" | "is greater than" | "is less than";
    minGoal?: number;
    maxGoal?: number;
    description?: string;
}

const tryParseQueryParams = (request: NextRequest): QueryParams => {
    const page = request.nextUrl.searchParams.get("page");
    const categoryId = request.nextUrl.searchParams.get("categoryId");
    const amountCondition = request.nextUrl.searchParams.get("amountCondition");
    const minAmount = request.nextUrl.searchParams.get("minAmount");
    const maxAmount = request.nextUrl.searchParams.get("maxAmount");
    const goalCondition = request.nextUrl.searchParams.get("goalCondition");
    const minGoal = request.nextUrl.searchParams.get("minGoal");
    const maxGoal = request.nextUrl.searchParams.get("maxGoal");
    const description = request.nextUrl.searchParams.get("description");

    return {
        page: page ? parseInt(page) : undefined,
        categoryId: categoryId ?? undefined,
        amountCondition: amountCondition as "is equal to" | "is between" | "is greater than" | "is less than",
        minAmount: minAmount ? parseFloat(minAmount) : undefined,
        maxAmount: maxAmount ? parseFloat(maxAmount) : undefined,
        goalCondition: goalCondition as "is equal to" | "is between" | "is greater than" | "is less than",
        minGoal: minGoal ? parseFloat(minGoal) : undefined,
        maxGoal: maxGoal ? parseFloat(maxGoal) : undefined,
        description: description ?? undefined
    }
}

const generatePrismaQuery = (params: QueryParams) => {
    const query = [];
    if (params.categoryId) {
        query.push({
            categoryId: {
                equals: params.categoryId
            }
        });
    }

    if (params.amountCondition) {
        if (params.amountCondition === "is equal to") {
            query.push({
                amount: {
                    equals: params.minAmount
                }
            });
        } else if (params.amountCondition === "is between") {
            query.push({
                amount: {
                    gte: params.minAmount,
                    lte: params.maxAmount
                }
            });
        } else if (params.amountCondition === "is greater than") {
            query.push({
                amount: {
                    gt: params.minAmount
                }
            });
        } else if (params.amountCondition === "is less than") {
            query.push({
                amount: {
                    lt: params.maxAmount
                }
            });
        }
    }

    if (params.goalCondition) {
        if (params.goalCondition === "is equal to") {
            query.push({
                goal: {
                    equals: params.minGoal
                }
            });
        } else if (params.goalCondition === "is between") {
            query.push({
                goal: {
                    gte: params.minGoal,
                    lte: params.maxGoal
                }
            });
        } else if (params.goalCondition === "is greater than") {
            query.push({
                goal: {
                    gt: params.minGoal
                }
            });
        } else if (params.goalCondition === "is less than") {
            query.push({
                goal: {
                    lt: params.maxGoal
                }
            });
        }
    }

    if (params.description) {
        query.push({
            description: {
                contains: params.description,
                mode: "insensitive"
            }
        });
    }

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
                AND: generatePrismaQuery(params) as any,
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
                AND: generatePrismaQuery(params) as any
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