import { Category } from "@prisma/client";
import { Pagination } from "./pagination";
import { QueryFunctionContext } from "@tanstack/react-query";

export type CategoryFilter = {
    archived?: boolean;
    description?: string;
}

export async function getCategories(ctx: QueryFunctionContext): Promise<Pagination<Category[]>> {
    const pageParam = ctx.pageParam || 0;
    const filter = (ctx.queryKey[1] as any)?.filter;

    const params = createParams(filter);
    params.set("page", pageParam.toString());
    const response = await fetch(`/api/v1/categories/list?${params.toString()}`);
    if (!response.ok) {
        throw new Error("Failed to fetch categories");
    }

    return await response.json();
}

function createParams(filter: CategoryFilter | undefined): URLSearchParams {
    const params = new URLSearchParams();
    if (filter?.archived) {
        params.set("archived", filter.archived.toString());
    }

    if (filter?.description) {
        params.set("search", filter.description);
    }
    return params;
}

export type CreateCategoryData = {
    title?: string;
    description?: string;
}

export async function createCategory(data: CreateCategoryData): Promise<Category> {
    const response = await fetch("/api/v1/categories", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error("Failed to create category");
    }

    return await response.json();
}

export type EditCategoryData = {
    id: string
} & CreateCategoryData;

export async function updateCategory(data: EditCategoryData): Promise<Category> {
    const response = await fetch(`/api/v1/categories/${data.id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            title: data.title,
            description: data.description
        })
    });

    if (!response.ok) {
        throw new Error("Failed to update category");
    }

    return await response.json();
}

export type ArchiveCategoryData = {
    id: string;
    archived: boolean;
}

export async function archiveCategory(data: ArchiveCategoryData): Promise<Category> {
    const response = await fetch(`/api/v1/categories/${data.id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            archived: data.archived
        })
    });

    if (!response.ok) {
        throw new Error("Failed to archive/unarchive category");
    }

    return await response.json();
}