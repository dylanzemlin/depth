import { Category } from "@prisma/client";
import { Pagination } from "./pagination";

// TODO: ADD FILTERS
export async function getCategories(): Promise<Pagination<Category[]>> {
    const response = await fetch("/api/v1/category/list?pageSize=100");
    if (!response.ok) {
        throw new Error("Failed to fetch categories");
    }

    return await response.json();
}