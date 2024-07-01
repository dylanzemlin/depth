import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import config from "./config";

type IronData = {
    user: {
        id: string;
        name: string;
        email: string;
        avatarUrl: string;
    } | null;
}

export async function withSessionRoute() {
    const c = cookies();
    return await getIronSession<IronData>(c, config)
}