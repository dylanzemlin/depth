import { Account, Category, Subscription } from "@prisma/client";
import { Pagination } from "./pagination";
import { QueryFunctionContext } from "@tanstack/react-query";
import { DateTime } from "luxon";

export type SubscriptionType = Subscription & {
    category: Category;
    account: Account;
}

export type SubscriptionFilter = {
    condition?: string;
    minCost?: number;
    maxCost?: number;
    accountId?: string;
    categoryId?: string;
    description?: string;
    frequency?: string;
    active?: boolean;
}

export async function getSubscriptions(ctx: QueryFunctionContext): Promise<Pagination<SubscriptionType[]>> {
    const pageParam = ctx.pageParam || 0;
    const filter = (ctx.queryKey[1] as any).filter as SubscriptionFilter;

    const params = createParams(filter);
    params.set("page", pageParam.toString());
    const response = await fetch(`/api/v1/subscriptions/list?${params.toString()}`);
    if (!response.ok) {
        throw new Error("Failed to fetch subscriptions");
    }

    return await response.json();
}

function createParams(filter: SubscriptionFilter): URLSearchParams {
    const params = new URLSearchParams();

    if (filter.condition) {
        params.set("condition", filter.condition);
    }

    if (filter.minCost) {
        params.set("minCost", filter.minCost.toString());
    }

    if (filter.maxCost) {
        params.set("maxCost", filter.maxCost.toString());
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

    if (filter.frequency) {
        params.set("frequency", filter.frequency);
    }

    if (filter.active) {
        params.set("active", filter.active.toString());
    }

    return params;
}

export type CreateSubscriptionData = {
    description?: string;
    amount?: number;
    frequency?: string;
    accountId?: string;
    categoryId?: string;
    startDate?: DateTime;
    endDate?: DateTime;
}

export async function createSubscription(data: CreateSubscriptionData): Promise<SubscriptionType> {
    const response = await fetch("/api/v1/subscriptions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            ...data,
            startDate: data.startDate?.toISO(),
            endDate: data.endDate?.toISO()
        })
    });

    if (!response.ok) {
        throw new Error("Failed to create subscription");
    }

    return await response.json();
}

export type EditSubscriptionData = {
    id?: string;
} & CreateSubscriptionData;

export async function editSubscription(data: EditSubscriptionData): Promise<SubscriptionType> {
    const response = await fetch(`/api/v1/subscriptions/${data.id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error("Failed to edit subscription");
    }

    return await response.json();
}

export async function deleteSubscription(id: string): Promise<void> {
    const response = await fetch(`/api/v1/subscriptions/${id}`, {
        method: "DELETE"
    });

    if (!response.ok) {
        throw new Error("Failed to delete subscription");
    }
}