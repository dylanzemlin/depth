import { withSessionRoute } from "@/lib/iron/wrappers";
import prisma from "@/lib/prisma";
import { SubscriptionFrequency } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

type QueryParams = {
    page?: number;
    category?: string;
    account?: string;
    condition?: "is equal to" | "is between" | "is greater than" | "is less than";
    minCost?: number;
    maxCost?: number;
    description?: string;
    frequency?: string;
    active?: boolean;
}

const tryParseQueryParams = (request: NextRequest): QueryParams => {
    const page = request.nextUrl.searchParams.get("page");
    const category = request.nextUrl.searchParams.get("categoryId");
    const account = request.nextUrl.searchParams.get("accountId");
    const condition = request.nextUrl.searchParams.get("condition");
    const minCost = request.nextUrl.searchParams.get("minCost");
    const maxCost = request.nextUrl.searchParams.get("maxCost");
    const description = request.nextUrl.searchParams.get("description");
    const frequency = request.nextUrl.searchParams.get("frequency");
    const active = request.nextUrl.searchParams.get("active");

    return {
        page: page ? parseInt(page) : undefined,
        category: category ?? undefined,
        account: account ?? undefined,
        condition: condition as "is equal to" | "is between" | "is greater than" | "is less than",
        minCost: minCost ? parseFloat(minCost) : undefined,
        maxCost: maxCost ? parseFloat(maxCost) : undefined,
        description: description ?? undefined,
        frequency: frequency ?? undefined,
        active: active ? active === "true" : undefined
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

    if (params.account) {
        query.push({
            accountId: {
                equals: params.account
            }
        });
    }

    if (params.condition) {
        if (params.condition === "is equal to") {
            query.push({
                amount: {
                    equals: params.minCost
                }
            });
        } else if (params.condition === "is between") {
            query.push({
                amount: {
                    gte: params.minCost,
                    lte: params.maxCost
                }
            });
        } else if (params.condition === "is greater than") {
            query.push({
                amount: {
                    gt: params.minCost
                }
            });
        } else if (params.condition === "is less than") {
            query.push({
                amount: {
                    lt: params.minCost
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

    if (params.frequency) {
        query.push({
            frequency: {
                equals: params.frequency as SubscriptionFrequency
            }
        });
    }

    if (params.active) {
        query.push({
            startDate: {
                lte: new Date()
            },
            endDate: {
                gte: new Date()
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
    const qry: any = generatePrismaQuery(params); // This "any" is awful but for some reason I am getting type errors :(

    try {
        const subscriptions = await prisma.subscription.findMany({
            where: {
                userId: session.user.id,
                AND: qry,
            },
            skip: params.page ? params.page * perPage : 0,
            take: perPage,
            orderBy: {
                startDate: "asc"
            },
            include: {
                category: true,
                account: true
            }
        })

        const totalSubscriptions = await prisma.subscription.count({
            where: {
                userId: session.user.id,
                AND: qry
            }
        });

        return NextResponse.json({
            data: subscriptions,
            pagination: {
                nextUrl: totalSubscriptions > (page + 1) * perPage ? `${request.nextUrl.pathname}?page=${page + 1}` : null,
                prevUrl: page > 0 ? `${request.nextUrl.pathname}?page=${page - 1}` : null,
                total: totalSubscriptions,
                current: page,
                pageSize: perPage
            }
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error }, { status: 400 });
    }
}