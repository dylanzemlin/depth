import { Account } from "@prisma/client";
import { Pagination } from "./pagination";

export async function getAccounts(): Promise<Pagination<Account[]>> {
    const response = await fetch("/api/v1/account/list?pageSize=100");
    if (!response.ok) {
        throw new Error("Failed to fetch accounts");
    }

    return await response.json();
}

export async function getAccountData({ queryKey }: { queryKey: any }) {
    const [_key, { accountId }] = queryKey;
    const response = await fetch(`/api/v1/account/${accountId}`);
    if (!response.ok) {
        throw new Error("Failed to fetch account data");
    }

    return await response.json();
}

export async function getAccountDashboardData({ queryKey }: { queryKey: any }) {
    const [_key, { accountId }] = queryKey;
    const response = await fetch(`/api/v1/account/${accountId}/dashboard`);
    if (!response.ok) {
        throw new Error("Failed to fetch account data");
    }

    return await response.json();
}