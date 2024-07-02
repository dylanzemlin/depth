import { withSessionRoute } from "@/lib/iron/wrappers";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { describe } from "node:test";
import { object, string, boolean } from "yup";

const schema = object({
    title: string().optional(),
    description: string().optional(),
    archived: boolean().optional()
})

export async function PATCH(request: NextRequest, { params }: {  params: { categoryID: string }}): Promise<NextResponse>
{
    const session = await withSessionRoute();
    if (session.user == null)
    {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (params.categoryID == null)
    {
        return NextResponse.json({ error: "Category ID is required" }, { status: 400 });
    }

    try {
        const { title, description, archived } = await schema.validate(await request.json());

        // Check if it exists and belongs to the user
        const category = await prisma.category.findFirst({
            where: {
                id: params.categoryID,
                userId: session.user.id
            }
        });

        if (category == null)
        {
            return NextResponse.json({ error: "Category not found" }, { status: 404 });
        }

        // Update the category
        const updatedCategory = await prisma.category.update({
            where: {
                id: params.categoryID
            },
            data: {
                title,
                description,
                archived
            }
        });

        return NextResponse.json(updatedCategory, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error }, { status: 400 });
    }
}