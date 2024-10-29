import { NextRequest } from "next/server";

export async function updateAccountData(request: NextRequest, accountId?: string) {
    try {
        const base_url = new URL(`${process.env.NEXT_PUBLIC_APP_URL}/api/sushi/update`);
        if (accountId != undefined) {
            base_url.searchParams.set("target_account", accountId);
        }
        
        const res = await fetch(base_url.toString(), {
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.SUSHI_SECRET}`
            }
        });
        console.log(JSON.stringify(await res.json()));
    } catch (error) {
        console.error("Failed to update account balance", error);
    }
}