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