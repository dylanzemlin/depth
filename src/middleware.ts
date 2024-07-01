import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { withSessionRoute } from './lib/iron/wrappers';

const unauthenticatedPaths = [
    "/login",
    "/register"
]

export async function middleware(request: NextRequest) {
    const session = await withSessionRoute();
    if (session.user && unauthenticatedPaths.includes(request.nextUrl.pathname)) {
        return NextResponse.redirect(new URL("/home", request.nextUrl));
    }

    // In the future everyone will be allowed to "/", but for now redirect everyone to /login
    if (request.nextUrl.pathname === "/") {
        return NextResponse.redirect(new URL("/login", request.nextUrl));
    }

    if (!session.user && !unauthenticatedPaths.includes(request.nextUrl.pathname)) {
        return NextResponse.error();
    }

    return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ]
}