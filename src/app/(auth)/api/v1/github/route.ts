import { withSessionRoute } from "@/lib/iron/wrappers";
import prisma from "@/lib/prisma";
import { Octokit } from "@octokit/rest";
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
    const session = await withSessionRoute();

    if (error) {
        return NextResponse.redirect(`/?error=${error}`);
    }

    if (!code) {
        return generateRedirectUrl(request, "no_code");
    }

    const form = {
        client_id: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        redirect_uri: process.env.NEXT_PUBLIC_GITHUB_REDIRECT,
        code: code
    }

    const result = await fetch("https://github.com/login/oauth/access_token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Accept": "application/json"
        },
        body: new URLSearchParams(form).toString()
    });

    if (!result.ok) {
        return generateRedirectUrl(request, "token_error");
    }

    const json = await result.json();
    console.log(json);
    if (!json.access_token) {
        return generateRedirectUrl(request, "token_error_not_found");
    }

    const octo = new Octokit({
        auth: json.access_token
    });

    const profile = await octo.users.getAuthenticated();
    if (profile.status != 200 || profile.data.email == null || profile.data.name == null) {
        return generateRedirectUrl(request, "profile_error");
    }

    const exists = await prisma.user.findFirst({
        where: {
            email: profile.data.email
        }
    });

    if (exists) {
        return generateRedirectUrl(request, "exists");
    }

    const urlEncodedName = encodeURIComponent(profile.data.name);
    const user = await prisma.user.create({
        data: {
            email: profile.data.email,
            name: profile.data.name,
            avatarUrl: profile.data.avatar_url ?? `https://ui-avatars.com/api/?rounded=true&name=${urlEncodedName}&size=51`,
            authTechnique: "github"
        }
    });

    session.user = {
        id: user.id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl
    }
    await session.save();

    return generateRedirectUrl(request, "success");
}