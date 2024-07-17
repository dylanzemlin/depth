import { Account, Category, Transaction } from "@prisma/client";
import { Pagination } from "./pagination";
import { DateRange } from "../types";

export type TransactionType = Transaction & {
    category: Category;
    account: Account;
}

export type TransactionFilter = {
    date?: DateRange;
    condition?: string;
    minCost?: number;
    maxCost?: number;
    status?: string;
    description?: string;
    categoryId?: string;
    accountId?: string;
}

export async function getTransactions({ queryKey }: { queryKey: any }): Promise<Pagination<TransactionType[]>> {
    const [_key, { filter }]: ["transactions", { filter: TransactionFilter }] = queryKey;

    const params = createParams(filter);
    const response = await fetch(`/api/v1/transactions/list?${params.toString()}`);
    if (!response.ok) {
        throw new Error("Failed to fetch transactions");
    }

    return await response.json();
}

function createParams(filter: TransactionFilter): URLSearchParams {
    const params = new URLSearchParams();
    if (filter.date) {
        if (filter.date.from) {
            params.set("from", filter.date.from.toISOString());
        }

        if (filter.date.to) {
            params.set("to", filter.date.to.toISOString());
        }
    }

    if (filter.condition) {
        params.set("condition", filter.condition);
    }

    if (filter.minCost) {
        params.set("minCost", filter.minCost.toString());
    }

    if (filter.maxCost) {
        params.set("maxCost", filter.maxCost.toString());
    }

    if (filter.status) {
        params.set("status", filter.status);
    }

    if (filter.description) {
        params.set("description", filter.description);
    }

    if (filter.categoryId) {
        params.set("categoryId", filter.categoryId);
    }

    if (filter.accountId) {
        params.set("accountId", filter.accountId);
    }

    return params;
}

export type CreateTransactionData = {
    description?: string,
    amount?: number,
    type?: string,
    status?: string,
    accountId?: string,
    categoryId?: string,
    date?: Date
}

export async function createTransaction(data: CreateTransactionData): Promise<TransactionType> {
    const response = await fetch("/api/v1/transactions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error("Failed to create transaction");
    }

    return await response.json();
}

export type EditTransactionData = {
    id: string
} & CreateTransactionData;

export async function updateTransaction(data: EditTransactionData): Promise<TransactionType> {
    const response = await fetch(`/api/v1/transactions/${data.id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        // Stringify data without id
        body: JSON.stringify({
            description: data.description,
            amount: data.amount,
            type: data.type,
            status: data.status,
            accountId: data.accountId,
            categoryId: data.categoryId,
            date: data.date
        })
    });

    if (!response.ok) {
        throw new Error("Failed to create transaction");
    }

    return await response.json();
}

export async function deleteTransaction(id: string): Promise<void> {
    const response = await fetch(`/api/v1/transactions/${id}`, {
        method: "DELETE"
    });

    if (!response.ok) {
        throw new Error("Failed to delete transaction");
    }
}