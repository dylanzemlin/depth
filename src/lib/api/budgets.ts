import { Budget } from "@prisma/client";
import { Pagination } from "./pagination";
import { DateTime } from "luxon";

export type BudgetType = Budget & {
    category: {
        title: string;
    }
}

export type BudgetFilter = {
    categoryId?: string;
    goalCondition?: string;
    minGoal?: number;
    maxGoal?: number;
    amountCondition?: string;
    minAmount?: number;
    maxAmount?: number;
    description?: string;
}

export async function getBudgets({ queryKey }: { queryKey: any }): Promise<Pagination<BudgetType[]>> {
    const [_key, { filter }]: ["budgets", { filter: BudgetFilter }] = queryKey;

    const params = new URLSearchParams();
    if (filter.categoryId) {
        params.append("categoryId", filter.categoryId.toString());
    }
    if (filter.description) {
        params.append("description", filter.description);
    }
    if (filter.amountCondition && filter.minAmount)
    {
        if (filter.minAmount) {
            params.append("minAmount", filter.minAmount.toString());
        }
        if (filter.maxAmount) {
            params.append("maxAmount", filter.maxAmount.toString());
        }

        params.append("amountCondition", filter.amountCondition);
    }
    if (filter.goalCondition && filter.minAmount)
    {
        if (filter.minGoal) {
            params.append("minGoal", filter.minGoal.toString());
        }
        if (filter.maxGoal) {
            params.append("maxGoal", filter.maxGoal.toString());
        }

        params.append("goalCondition", filter.goalCondition);
    }

    const response = await fetch(`/api/v1/budgets/list?${params.toString()}`);
    if (!response.ok) {
        throw new Error("Failed to fetch budgets");
    }

    return await response.json();
}

export type CreateBudgetData = {
    description?: string;
    goal?: number;
    categoryId?: string;
    startDate?: DateTime;
    endDate?: DateTime;
}

export async function createBudget(data: CreateBudgetData) {
    const response = await fetch("/api/v1/budgets", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            ...data,
            startDate: data.startDate?.toISO(),
            endDate: data.endDate?.toISO(),
        }),
    });
    if (!response.ok) {
        throw new Error("Failed to create budget");
    }
}

export type EditBudgetData = {
    id: string;
} & CreateBudgetData;

export async function editBudget(data: EditBudgetData) {
    const response = await fetch(`/api/v1/budgets/${data.id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        throw new Error("Failed to create budget");
    }
}

export async function deleteBudget(id: string) {
    const response = await fetch(`/api/v1/budgets/${id}`, {
        method: "DELETE",
    });
    if (!response.ok) {
        throw new Error("Failed to delete budget");
    }
}