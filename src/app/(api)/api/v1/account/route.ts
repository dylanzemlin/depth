import { withSessionRoute } from "@/lib/iron/wrappers";
import prisma from "@/lib/prisma";
import { AccountType } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { number, object, string } from "yup";

const schema = object({
    name: string().required(),
    type: string().oneOf(["checking", "savings", "credit", "other"]),
    balance: number().optional().default(0),
    creditLimit: number().when("type", {
        is: "credit",
        then: (schema) => schema.required().min(0),
        otherwise: (schema) => schema.optional().default(0)
    })
})

const typeToAccountType = (type: string | undefined): AccountType => {
    switch (type) {
        case "checking":
            return AccountType.CHECKINGS;
        case "savings":
            return AccountType.SAVINGS;
        case "credit":
            return AccountType.CREDIT;
        default:
            return AccountType.OTHER;
    }
}

export async function POST(request: NextRequest): Promise<NextResponse>
{
    const session = await withSessionRoute();
    if (session.user == null)
    {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { name, type, balance, creditLimit } = await schema.validate(await request.json());

        // Create account
        const account = await prisma.account.create({
            data: {
                name,
                type: typeToAccountType(type),
                balance,
                creditLimit,
                pendingBalance: 0,
                user: {
                    connect: {
                        id: session.user.id
                    }
                }
            }
        })

        return NextResponse.json(account, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error }, { status: 400 });
    }
}