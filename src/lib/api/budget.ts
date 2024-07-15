import { Budget } from "@prisma/client";
import { Pagination } from "./pagination";

export type BudgetType = Budget & {
    category: {
        title: string;
    }
}

export type BudgetFilter = {
    categoryId?: string;
    condition?: string;
    goal_1?: number;
    goal_2?: number;
    description?: string;
}

export async function getBudgets({ queryKey }: { queryKey: any }): Promise<Pagination<BudgetType[]>> {
    const [_key, { filter }]: ["budgets", { filter: BudgetFilter }] = queryKey;

    const params = new URLSearchParams();
    if (filter.categoryId) {
        params.append("categoryId", filter.categoryId.toString());
    }
    if (filter.condition) {
        params.append("condition", filter.condition);
    }
    if (filter.goal_1) {
        params.append("goal_1", filter.goal_1.toString());
    }
    if (filter.goal_2) {
        params.append("goal_2", filter.goal_2.toString());
    }
    if (filter.description) {
        params.append("description", filter.description);
    }

    const response = await fetch(`/api/v1/budget/list?${params.toString()}`);
    if (!response.ok) {
        throw new Error("Failed to fetch budgets");
    }

    return await response.json();
}

export type NewBudget = {
    description: string;
    goal: number;
    categoryId: string;
    startDate: Date;
    endDate?: Date;
}

export async function createBudget(budget: NewBudget) {
    const response = await fetch("/api/v1/budget", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(budget),
    });
    if (!response.ok) {
        throw new Error("Failed to create budget");
    }
}