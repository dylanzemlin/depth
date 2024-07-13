import { Budget } from "@prisma/client";
import { Pagination } from "./pagination";

type BudgetType = Budget & {
    category: {
        title: string;
    }
}

export async function getBudgets({ queryKey }: { queryKey: any }): Promise<Pagination<BudgetType[]>> {
    const [_key, { categoryId, condition, goal_1, goal_2, description }] = queryKey;

    const params = new URLSearchParams();
    if (categoryId) {
        params.append("categoryId", categoryId.toString());
    }
    if (condition) {
        params.append("condition", condition);
    }
    if (goal_1) {
        params.append("goal_1", goal_1.toString());
    }
    if (goal_2) {
        params.append("goal_2", goal_2.toString());
    }
    if (description) {
        params.append("description", description);
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