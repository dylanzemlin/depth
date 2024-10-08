import { updateAccountData } from "@/lib/api/sushi";
import { withSessionRoute } from "@/lib/iron/wrappers";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { object, string, number, date } from "yup";
import { DateTime } from "luxon";

const schema = object({
    description: string().required(),
    goal: number().required(),
    categoryId: string().required(),
    startDate: date().required(),
    endDate: date().optional()
})

export async function POST(request: NextRequest): Promise<NextResponse>
{
    const session = await withSessionRoute();
    if (session.user == null)
    {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { description, goal, categoryId, startDate, endDate } = await schema.validate(await request.json());

        // Create budget
        const budget = await prisma.budget.create({
            data: {
                description,
                amount: 0,
                goal,
                startDate: DateTime.fromJSDate(startDate).toJSDate(),
                endDate: endDate != undefined ? DateTime.fromJSDate(endDate).toJSDate() : undefined,
                category: {
                    connect: {
                        id: categoryId
                    }
                },
                user: {
                    connect: {
                        id: session.user.id
                    }
                }
            }
        })

        await updateAccountData(request);
        return NextResponse.json(budget, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error }, { status: 400 });
    }
}