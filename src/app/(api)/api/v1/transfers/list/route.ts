import { withSessionRoute } from "@/lib/iron/wrappers";
import prisma from "@/lib/prisma";
import { TransferStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

type QueryParams = {
    page?: number;
    category?: string;
    from?: Date;
    to?: Date;
    fromAccount?: string;
    toAccount?: string;
    condition?: "is equal to" | "is between" | "is greater than" | "is less than";
    minCost?: number;
    maxCost?: number;
    description?: string;
    status?: TransferStatus;
}

const tryParseQueryParams = (request: NextRequest): QueryParams => {
    const page = request.nextUrl.searchParams.get("page");
    const category = request.nextUrl.searchParams.get("categoryId");
    const from = request.nextUrl.searchParams.get("from");
    const to = request.nextUrl.searchParams.get("to");
    const fromAccount = request.nextUrl.searchParams.get("fromAccountId");
    const toAccount = request.nextUrl.searchParams.get("toAccountId");
    const condition = request.nextUrl.searchParams.get("condition");
    const minCost = request.nextUrl.searchParams.get("minCost");
    const maxCost = request.nextUrl.searchParams.get("maxCost");
    const description = request.nextUrl.searchParams.get("description");
    const status = request.nextUrl.searchParams.get("status");

    return {
        page: page ? parseInt(page) : undefined,
        category: category ?? undefined,
        fromAccount: fromAccount ?? undefined,
        toAccount: toAccount ?? undefined,
        condition: condition as "is equal to" | "is between" | "is greater than" | "is less than",
        minCost: minCost ? parseFloat(minCost) : undefined,
        maxCost: maxCost ? parseFloat(maxCost) : undefined,
        description: description ?? undefined,
        status: status as TransferStatus
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

    if (params.fromAccount) {
        query.push({
            fromAccountId: {
                equals: params.fromAccount
            }
        });
    }

    if (params.toAccount) {
        query.push({
            toAccountId: {
                equals: params.toAccount
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

    if (params.status) {
        query.push({
            status: {
                equals: params.status
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
        const tranfers = await prisma.transfer.findMany({
            where: {
                userId: session.user.id,
                AND: qry,
            },
            skip: params.page ? params.page * perPage : 0,
            take: perPage,
            orderBy: {
                date: "asc"
            },
            include: {
                category: true,
                fromAccount: true,
                toAccount: true
            }
        })

        const totalTransfers = await prisma.transfer.count({
            where: {
                userId: session.user.id,
                AND: qry
            }
        });

        return NextResponse.json({
            data: tranfers,
            pagination: {
                nextUrl: totalTransfers > (page + 1) * perPage ? `${request.nextUrl.pathname}?page=${page + 1}` : null,
                prevUrl: page > 0 ? `${request.nextUrl.pathname}?page=${page - 1}` : null,
                total: totalTransfers,
                current: page,
                pageSize: perPage
            }
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error }, { status: 400 });
    }
}