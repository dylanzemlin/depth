import { withSessionRoute } from "@/lib/iron/wrappers";
import { NextRequest, NextResponse } from "next/server";
import { object, string } from "yup";
import crypto from "crypto";
import prisma from "@/lib/prisma";

import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(timezone);

const schema = object({
    email: string().email().required(),
    name: string().required(),
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
        const { email, name, password } = await schema.validate(json);

        const salt = crypto.randomBytes(128).toString("hex");
        const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex");

        const urlEncodedName = encodeURIComponent(name);
        const user = await prisma.user.create({
            data: {
                email,
                name,
                avatarUrl: `https://ui-avatars.com/api/?rounded=true&name=${urlEncodedName}&size=51`,
                password: hash,
                passwordIterations: 100000,
                passwordSalt: salt,
                authTechnique: "email"
            }
        });

        session.user = {
            id: user.id,
            name: user.name,
            email: user.email,
            avatarUrl: user.avatarUrl,
            role: user.role,
            timezone: dayjs.tz.guess()
        }
        await session.save();

        return NextResponse.json(user, { status: 201 });
    } catch (e: any) {
        return NextResponse.json({ message: "Invalid request body", error: e }, { status: 400 });
    }
}