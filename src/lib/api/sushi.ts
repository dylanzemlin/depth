import { NextRequest } from "next/server";

export async function updateAccountData(request: NextRequest, accountId?: string) {
    try {
        const url = request.nextUrl.clone();
        url.pathname = "/api/sushi/update";
        if (accountId != undefined) {
            url.searchParams.set("target_account", accountId);
        }
        
        await fetch(url.toString(), {
            headers: {
                Authorization: `Bearer ${process.env.SUSHI_SECRET}`
            }
        });
    } catch (error) {
        console.error("Failed to update account balance", error);
    }
}