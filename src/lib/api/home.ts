export async function getHomeData() {
    const response = await fetch("/api/v1/home");
    if (!response.ok)
    {
        throw new Error("Failed to fetch home data");
    }

    return await response.json();
}