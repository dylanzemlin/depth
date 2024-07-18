import { withSessionRoute } from "@/lib/iron/wrappers";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { object, string } from "yup";

const schema = object({
    title: string().required(),
    description: string().required()
})

export async function POST(request: NextRequest): Promise<NextResponse>
{
    const session = await withSessionRoute();
    if (session.user == null)
    {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { title, description } = await schema.validate(await request.json());

        // Create category
        const category = await prisma.category.create({
            data: {
                title,
                description,
                user: {
                    connect: {
                        id: session.user.id
                    }
                }
            }
        })

        return NextResponse.json(category, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error }, { status: 400 });
    }
}