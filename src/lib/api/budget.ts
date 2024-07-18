import { Budget } from "@prisma/client";
import { Pagination } from "./pagination";

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
    if (filter.amountCondition)
    {
        if (filter.minAmount) {
            params.append("minAmount", filter.minAmount.toString());
        }
        if (filter.maxAmount) {
            params.append("maxAmount", filter.maxAmount.toString());
        }

        params.append("amountCondition", filter.amountCondition);
    }
    if (filter.goalCondition)
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

export type NewBudget = {
    description: string;
    goal: number;
    categoryId: string;
    startDate: Date;
    endDate?: Date;
}

export async function createBudget(budget: NewBudget) {
    const response = await fetch("/api/v1/budgets", {
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