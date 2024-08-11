import { withSessionRoute } from "@/lib/iron/wrappers";
import { NextRequest, NextResponse } from "next/server";
import { DateTime } from "luxon";

export async function GET(request: NextRequest): Promise<NextResponse>
{
    const session = await withSessionRoute();
    if (session.user == null)
    {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.timezone == null)
    {
        session.destroy();
        return NextResponse.json({ error: "Old Cookies" }, { status: 400 });
    }

    const serverNow = DateTime.now();
    const serverTz = serverNow.zoneName;
    const userNow = serverNow.setZone(session.user.timezone);

    return NextResponse.json({
        serverNow: serverNow.toFormat('yyyy-MM-dd HH:mm:ss'),
        serverNowUtc: serverNow.toUTC().toFormat('yyyy-MM-dd HH:mm:ss'),
        serverTz: serverTz,
        userNow: userNow.toFormat('yyyy-MM-dd HH:mm:ss'),
        userNowUtc: userNow.toUTC().toFormat('yyyy-MM-dd HH:mm:ss'),
        userTz: session.user.timezone
    });
}