import { withSessionRoute } from "@/lib/iron/wrappers";
import { NextResponse } from "next/server";

export async function GET(): Promise<NextResponse>
{
    const session = await withSessionRoute();
    return NextResponse.json(session);
}