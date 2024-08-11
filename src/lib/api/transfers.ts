import { Account, Category, Transfer } from "@prisma/client";
import { Pagination } from "./pagination";
import { QueryFunctionContext } from "@tanstack/react-query";
import { DateRange } from "../types";
import { DateTime } from "luxon";

export type TransferType = {
    category: Category;
    fromAccount: Account;
    toAccount: Account;
} & Transfer;

export type TransferFilter = {
    date?: DateRange;
    condition?: string;
    minCost?: number;
    maxCost?: number;
    status?: string;
    description?: string;
    categoryId?: string;
    fromAccountId?: string;
    toAccountId?: string;
}

export async function getTransfers(ctx: QueryFunctionContext): Promise<Pagination<TransferType[]>> {
    const pageParam = ctx.pageParam || 0;
    console.log(ctx.queryKey);
    const filter = (ctx.queryKey[1] as any).filter as TransferFilter;

    const params = createParams(filter);
    params.set("page", pageParam.toString());
    const response = await fetch(`/api/v1/transfers/list?${params.toString()}`);
    if (!response.ok) {
        throw new Error("Failed to fetch transfers");
    }

    return await response.json();
}

function createParams(filter: TransferFilter): URLSearchParams {
    const params = new URLSearchParams();
    if (filter.date) {
        params.set("date", filter.date.toString());
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
    if (filter.fromAccountId) {
        params.set("fromAccountId", filter.fromAccountId);
    }
    if (filter.toAccountId) {
        params.set("toAccountId", filter.toAccountId);
    }
    return params;
}

export type CreateTransferData = {
    fromAccountId?: string;
    toAccountId?: string;
    status?: string;
    description?: string;
    amount?: number;
    categoryId?: string;
    date?: DateTime;
}

export async function createTransfer(data: CreateTransferData): Promise<TransferType> {
    const response = await fetch("/api/v1/transfers", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            ...data,
            date: data.date?.toISO(),
        }),
    });
    if (!response.ok) {
        throw new Error("Failed to create transfer");
    }

    return await response.json();
}

export type EditTransferData = {
    id: string
} & CreateTransferData;

export async function updateTransfer(data: EditTransferData): Promise<TransferType> {
    const response = await fetch(`/api/v1/transfers/${data.id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        // Stringify data without id
        body: JSON.stringify({
            description: data.description,
            amount: data.amount,
            status: data.status,
            categoryId: data.categoryId,
            date: data.date?.toISO(),
            fromAccountId: data.fromAccountId,
            toAccountId: data.toAccountId
        })
    });

    if (!response.ok) {
        throw new Error("Failed to update transfer");
    }

    return await response.json();
}

export async function deleteTransfer(transferID: string): Promise<void> {
    const response = await fetch(`/api/v1/transfers/${transferID}`, {
        method: "DELETE",
    });
    if (!response.ok) {
        throw new Error("Failed to delete transfer");
    }

    return;
}