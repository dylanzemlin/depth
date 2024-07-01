import { withSessionRoute } from "@/lib/iron/wrappers";
import { NextResponse } from "next/server";

export async function POST(): Promise<NextResponse> {
    const session = await withSessionRoute();
    if (session.user == null) {
        return NextResponse.json({}, { status: 200 });
    }

    session.destroy();
    return NextResponse.json({}, { status: 200 });
}