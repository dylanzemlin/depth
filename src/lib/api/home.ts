import { QueryFunctionContext } from "@tanstack/react-query";

export async function getHomeData(ctx: QueryFunctionContext) {
    const year = (ctx.queryKey[1] as any)?.year;
    const month = (ctx.queryKey[1] as any)?.month;

    const response = await fetch(`/api/v1/home?year=${year}&month=${month}`);
    if (!response.ok)
    {
        throw new Error("Failed to fetch home data");
    }

    return await response.json();
}