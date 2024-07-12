import { Budget } from "@prisma/client";
import { useEffect, useState } from "react";
import { Pagination, PaginationProps } from "../api/pagination";

type UseBudgetProps = {
    page?: number;
    filter?: {
        categoryId?: string;
        condition?: "is equal to" | "is between" | "is greater than" | "is less than";
        goal_1?: number;
        goal_2?: number;
        description?: string;
    }
}

type UseBudgetReturn = {
    budgets?: BudgetType[];
    pagination?: PaginationProps;
    loading: boolean;
    createBudget: (data: CreateBudgetData) => Promise<boolean>;
    fetchBudgets: () => Promise<void>;
}

type CreateBudgetData = {
    categoryId: string;
    description: string;
    goal: number;
    startDate: Date;
    endDate?: Date;
}

type BudgetType = Budget & {
    category: {
        title: string;
    }
}

export default function useBudgets(props: UseBudgetProps): UseBudgetReturn {
    const [budgets, setBudgets] = useState<BudgetType[]>();
    const [pagination, setPagination] = useState<PaginationProps>();
    const [loading, setLoading] = useState(true);

    const createBudget = async (data: CreateBudgetData) => {
        const response = await fetch("/api/v1/budget", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        if (response.status === 201) {
            const newBudget = await response.json();
            setBudgets([...(budgets || []), newBudget]);
            return true;
        }

        return false;
    }

    const fetchBudgets = async () => {
        const params = new URLSearchParams();
        if (props.page) {
            params.append("page", props.page.toString());
        }

        if (props.filter) {
            if (props.filter.categoryId) {
                params.append("category", props.filter.categoryId);
            }

            if (props.filter.condition) {
                params.append("condition", props.filter.condition);
            }

            if (props.filter.goal_1) {
                params.append("goal_1", props.filter.goal_1.toString());
            }

            if (props.filter.goal_2) {
                params.append("goal_2", props.filter.goal_2.toString());
            }

            if (props.filter.description) {
                params.append("description", props.filter.description);
            }
        }

        setLoading(true);
        const response = await fetch(`/api/v1/budget/list?${params.toString()}`);
        const json: Pagination<BudgetType[]> = await response.json();
        setBudgets(json.data);
        setPagination(json.pagination);
        setLoading(false);
    };

    useEffect(() => {
        fetchBudgets();
    }, []);

    return { budgets, pagination, loading, createBudget, fetchBudgets };
}