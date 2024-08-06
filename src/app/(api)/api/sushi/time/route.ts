import dayjs from "@/lib/dayjs";
import { withSessionRoute } from "@/lib/iron/wrappers";
import { NextRequest, NextResponse } from "next/server";

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

    const serverTz = dayjs.tz.guess();
    const serverNow = dayjs().tz(serverTz);
    const userNow = dayjs().tz(session.user.timezone);

    const isUserAfter = userNow.isAfter(serverNow);
    const isUserBefore = userNow.isBefore(serverNow);
    const isUserEqual = userNow.isSame(serverNow);
    const diff = userNow.diff(serverNow, 'minute');

    return NextResponse.json({
        serverNow: serverNow.format('YYYY-MM-DD HH:mm:ss'),
        serverTz: serverTz,
        userNow: userNow.format('YYYY-MM-DD HH:mm:ss'),
        userTz: session.user.timezone,
        other: {
            isUserAfter: isUserAfter,
            isUserBefore: isUserBefore,
            isUserEqual: isUserEqual,
            diff: diff
        }
    });
}