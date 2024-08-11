import { updateAccountData } from "@/lib/api/sushi";
import { withSessionRoute } from "@/lib/iron/wrappers";
import prisma from "@/lib/prisma";
import { DateTime } from "luxon";
import { NextRequest, NextResponse } from "next/server";
import { object, string, number, date } from "yup";

const schema = object({
    description: string().optional(),
    goal: number().optional(),
    categoryId: string().optional(),
    startDate: date().optional(),
    endDate: date().optional(),
})

export async function PATCH(request: NextRequest, { params }: {  params: { budgetID: string }}): Promise<NextResponse>
{
    const session = await withSessionRoute();
    if (session.user == null)
    {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { description, goal, categoryId, startDate, endDate } = await schema.validate(await request.json());

        // Update budget
        const budget = await prisma.budget.update({
            where: {
                id: params.budgetID,
                userId: session.user.id
            },
            data: {
                description,
                amount: 0,
                goal,
                startDate: startDate != undefined ? DateTime.fromJSDate(startDate).toJSDate() : undefined,
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
        return NextResponse.json(budget, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error }, { status: 400 });
    }
}

export async function DELETE(request: NextRequest, { params }: {  params: { budgetID: string }}): Promise<NextResponse>
{
    const session = await withSessionRoute();
    if (session.user == null)
    {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        await prisma.budget.delete({
            where: {
                id: params.budgetID,
                userId: session.user.id
            }
        })

        await updateAccountData(request);
        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error }, { status: 400 });
    }
}