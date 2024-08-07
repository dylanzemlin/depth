import { withSessionRoute } from "@/lib/iron/wrappers";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

function generateRedirectUrl(request: NextRequest, error: string) {
    const clone = request.nextUrl.clone();
    clone.searchParams.set("error", error);
    clone.pathname = "/login";
    return NextResponse.redirect(clone.toString());

}

export async function GET(request: NextRequest): Promise<NextResponse> {
    const code = request.nextUrl.searchParams.get("code");
    const error = request.nextUrl.searchParams.get("error");
    const state = request.nextUrl.searchParams.get("state");
    const session = await withSessionRoute();

    if (error) {
        return NextResponse.redirect(`/?error=${error}`);
    }

    if (!code) {
        return generateRedirectUrl(request, "no_code");
    }

    let timezone = "America/Chicago";
    if (state != null) {
        try {
            timezone = JSON.parse(atob(state)).timezone;
        } catch (error) {
            console.error(error);
        }
    }

    const form = {
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: process.env.NEXT_PUBLIC_GOOGLE_REDIRECT,
        grant_type: "authorization_code",
        code
    }

    const result = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams(form).toString()
    });

    if (!result.ok) {
        return generateRedirectUrl(request, "token_error");
    }

    const { access_token } = await result.json();
    const profile = await fetch("https://www.googleapis.com/oauth2/v3/userinfo?alt=json", {
        headers: {
            Authorization: `Bearer ${access_token}`
        }
    });

    if (!profile.ok) {
        return generateRedirectUrl(request, "profile_error");
    }

    const { name, email, picture } = await profile.json();

    const exists = await prisma.user.findFirst({
        where: {
            email,
            NOT: {
                authTechnique: "google"
            }
        }
    });

    if (exists) {
        return generateRedirectUrl(request, "exists");
    }

    const urlEncodedName = encodeURIComponent(name);
    const user = await prisma.user.upsert({
        where: { email },
        update: {
            name,
            avatarUrl: picture ?? `https://ui-avatars.com/api/?rounded=true&name=${urlEncodedName}&size=51`,
            authTechnique: "google",
            timezone
        },
        create: {
            email,
            name,
            avatarUrl: picture ?? `https://ui-avatars.com/api/?rounded=true&name=${urlEncodedName}&size=51`,
            authTechnique: "google",
            timezone
        }
    });

    session.user = {
        id: user.id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,
        role: user.role,
        timezone
    }
    await session.save();

    return generateRedirectUrl(request, "success");
}