import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import config from "./config";

type IronData = {
    user: {
        id: string;
        name: string;
        email: string;
        avatarUrl: string;
        role: "ADMIN" | "USER";
    } | null;
}

export async function withSessionRoute() {
    const c = cookies();
    return await getIronSession<IronData>(c, config)
}