import { withSessionRoute } from "@/lib/iron/wrappers";
import { NextRequest, NextResponse } from "next/server";
import { object, string } from "yup";
import crypto from "crypto";
import prisma from "@/lib/prisma";

const schema = object({
    email: string().email().required(),
    password: string().required()
})

export async function POST(request: NextRequest): Promise<NextResponse> {
    let json: any;
    try {
        json = await request.json();
    } catch (e: any) {
        return NextResponse.json({ message: "Failed to parse request body", error: e }, { status: 400 });
    }

    const session = await withSessionRoute();
    if (session.user != null) {
        return NextResponse.json({ message: "Already logged in" }, { status: 200 });
    }

    try {
        const { email, password } = await schema.validate(json);

        const user = await prisma.user.findFirst({
            where: {
                email
            }
        });

        if (user == null || user.authTechnique !== "email" || user.passwordSalt == null || user.passwordIterations == null) {
            return NextResponse.json({ message: "Invalid email or password" }, { status: 400 });
        }

        const hash = crypto.pbkdf2Sync(password, user.passwordSalt, user.passwordIterations, 64, "sha512").toString("hex");
        if (hash !== user.password) {
            return NextResponse.json({ message: "Invalid email or password" }, { status: 400 });
        }

        session.user = {
            id: user.id,
            name: user.name,
            email: user.email,
            avatarUrl: user.avatarUrl
        }
        await session.save();

        return NextResponse.json(user, { status: 200 });
    } catch (e: any) {
        return NextResponse.json({ message: "Invalid request body", error: e }, { status: 400 });
    }
}