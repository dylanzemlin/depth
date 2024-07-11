import { withSessionRoute } from "@/lib/iron/wrappers";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

type QueryParams = {
    page?: number;
    from?: Date;
    to?: Date;
    category?: string;
    account?: string;
    status?: "CLEARED" | "PENDING" | "CANCELLED";
    condition?: "is equal to" | "is between" | "is greater than" | "is less than";
    cost_1?: number;
    cost_2?: number;
    description?: string;
}

const tryParseQueryParams = (request: NextRequest): QueryParams => {
    const page = request.nextUrl.searchParams.get("page");
    const from = request.nextUrl.searchParams.get("from");
    const to = request.nextUrl.searchParams.get("to");
    const category = request.nextUrl.searchParams.get("category");
    const account = request.nextUrl.searchParams.get("account");
    const status = request.nextUrl.searchParams.get("status");
    const condition = request.nextUrl.searchParams.get("condition");
    const cost_1 = request.nextUrl.searchParams.get("cost_1");
    const cost_2 = request.nextUrl.searchParams.get("cost_2");
    const description = request.nextUrl.searchParams.get("description");

    return {
        page: page ? parseInt(page) : undefined,
        from: from ? new Date(from) : undefined,
        to: to ? new Date(to) : undefined,
        category: category ?? undefined,
        account: account ?? undefined,
        status: status as "CLEARED" | "PENDING" | "CANCELLED",
        condition: condition as "is equal to" | "is between" | "is greater than" | "is less than",
        cost_1: cost_1 ? parseFloat(cost_1) : undefined,
        cost_2: cost_2 ? parseFloat(cost_2) : undefined,
        description: description ?? undefined
    }
}

const generatePrismaQuery = (params: QueryParams) => {
    const query = [];
    if (params.from) {
        query.push({
            date: {
                gte: params.from
            }
        });
    }

    if (params.to) {
        query.push({
            date: {
                lte: params.to
            }
        });
    }

    if (params.category) {
        query.push({
            categoryId: {
                equals: params.category
            }
        });
    }

    if (params.account) {
        query.push({
            accountId: {
                equals: params.account
            }
        });
    }

    if (params.status) {
        query.push({
            status: {
                equals: params.status
            }
        });
    }

    if (params.condition) {
        if (params.condition === "is equal to") {
            query.push({
                amount: {
                    equals: params.cost_1
                }
            });
        } else if (params.condition === "is between") {
            query.push({
                amount: {
                    gte: params.cost_1,
                    lte: params.cost_2
                }
            });
        } else if (params.condition === "is greater than") {
            query.push({
                amount: {
                    gt: params.cost_1
                }
            });
        } else if (params.condition === "is less than") {
            query.push({
                amount: {
                    lt: params.cost_1
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
    const qry = generatePrismaQuery(params);

    try {
        const transactions = await prisma.transaction.findMany({
            where: {
                userId: session.user.id,
                AND: generatePrismaQuery(params),
            },
            skip: params.page ? params.page * perPage : 0,
            take: perPage,
            orderBy: {
                date: "desc"
            }
        })

        const totalCategories = await prisma.transaction.count({
            where: {
                userId: session.user.id,
                AND: generatePrismaQuery(params)
            }
        });

        return NextResponse.json({
            data: transactions,
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