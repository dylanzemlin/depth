"use client";

import FullError from "@/components/feedback/FullError";
import FullLoading from "@/components/feedback/FullLoading";
import { getBudgets } from "@/lib/api/budget";
import { getHomeData } from "@/lib/api/home";
import { useQuery } from "@tanstack/react-query";
import { Card, LineChart, ProgressBar } from "@tremor/react";
import dayjs from "dayjs";
import { useId } from "react";

type BudgetdataProps = {
    value: number;
    max: number;
    title: string;
    category: string;
}

const BudgetData = (props: BudgetdataProps) => {
    const tooltipId = useId();
    const perecent = (props.value / props.max) * 100;
    const daysUntilEnd = dayjs().daysInMonth() - dayjs().date();

    return (
        <>
            <p className="flex justify-between text-sm gap-8">
                <div className="flex flex-col">
                    <span className="font-medium">
                        {props.title} <span className="text-indigo-500">({props.category})</span>
                    </span>
                    <span className="text-gray-500 text-xs">
                        {daysUntilEnd} days left
                    </span>
                </div>
                <div className="flex flex-col items-end">
                    <span className="font-medium">
                        ${props.value.toFixed(2)}
                        <span className="mx-1">
                            /
                        </span>
                        <span className="font-normal text-gray-500">
                            ${props.max.toFixed(2)}
                        </span>
                    </span>
                    <span className="text-gray-500 text-xs">
                        {perecent.toFixed(1)}%
                    </span>
                </div>
            </p>
            <div className="flex w-full items-center mt-2 [&>*]:h-1.5" data-tooltip-target={tooltipId}>
                <div className="relative flex h-2 w-full items-center rounded-full bg-indigo-100" aria-label="progress bar" aria-valuenow={492.15} aria-valuemax={1000.00}>
                    <div className="h-full flex-col rounded-full bg-indigo-600" style={{
                        width: `${Math.min((props.value / props.max) * 100, 100)}%`
                    }}>
                    </div>
                </div>
            </div>
            <div id={tooltipId} role="tooltip" className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip">
                <span className="font-bold">
                    {((props.value / props.max) * 100).toFixed(1)}%
                </span>
                <div className="tooltip-arrow" data-popper-arrow></div>
            </div>
        </>
    )
}

type HomeData = {
    totalBalance: number;
    income: number;
    expenses: number;
    incomeMapByDay: Record<number, number>;
    expenseMapByDay: Record<number, number>;
}

export default function Home() {
    const homeQuery = useQuery({ queryKey: ["home"], queryFn: getHomeData });
    const budgetQuery = useQuery({ queryKey: ["budgets", { filter: {} }], queryFn: getBudgets });

    if (homeQuery.isPending || budgetQuery.isPending) {
        return <FullLoading injectMain />
    }

    if (homeQuery.isError || budgetQuery.isError) {
        return <FullError injectMain error={homeQuery.error || budgetQuery.error} />
    }

    const homeData = homeQuery.data as HomeData;
    const budgets = budgetQuery.data;
    const incomePercentage = homeData?.income / (homeData?.income + homeData?.expenses) * 100;
    const expensesPercentage = homeData?.expenses / (homeData?.income + homeData?.expenses) * 100;

    const dayNumToDisplayDate = (dayNum: number) => {
        return dayjs(new Date(new Date().getFullYear(), new Date().getMonth(), dayNum)).format('MMMM DD');
    }

    const graphData = Array.from({ length: dayjs().date() }, (_, i) => {
        const date = i + 1;
        return {
            date: dayNumToDisplayDate(date),
            Expenses: homeData?.expenseMapByDay[date] ?? 0,
            Deposits: homeData?.incomeMapByDay[date] ?? 0
        }
    });

    return (
        <main className="flex min-h-screen w-full flex-col gap-4 p-4 md:p-12 overflow-hidden overflow-y-auto">
            <section aria-labelledby="current-budget">
                <h1 className="scroll-mt-10 text-3xl mb-2">
                    Overview
                </h1>
                <div className="flex gap-4 flex-wrap">
                    <Card className="max-w-sm">
                        <h4 className="text-tremor-default text-tremor-content">
                            Total Balance
                        </h4>
                        <p className="font-semibold text-2xl">
                            ${homeData?.totalBalance.toFixed(2) ?? 0}
                        </p>
                    </Card>
                    <Card className="max-w-md">
                        <h4 className="text-tremor-default text-tremor-content">
                            Income vs Expenses
                        </h4>
                        <div className="flex gap-2 items-center">
                            <p className="font-semibold text-2xl">
                                ${homeData?.income.toFixed(2) ?? 0}
                            </p>
                            <span className="text-lg">
                                vs
                            </span>
                            <p className="font-semibold text-2xl">
                                ${homeData?.expenses.toFixed(2) ?? 0}
                            </p>
                        </div>
                        <p className="mt-4 flex items-center justify-between text-tremor-default text-tremor-content dark:text-dark-tremor-content">
                            <span>{incomePercentage.toFixed(1)}%</span>
                            <span>{expensesPercentage.toFixed(1)}%</span>
                        </p>
                        <div className="flex relative">
                            <ProgressBar color="blue" value={100} className={`mt-2 [&>*>*]:!rounded-r-none [&>*]:!rounded-r-none`} style={{
                                width: `${incomePercentage}%`
                            }} />
                            <ProgressBar color="red" value={100} className={`mt-2 [&>*>*]:!rounded-l-none [&>*]:!rounded-l-none`} style={{
                                width: `${expensesPercentage}%`
                            }} />
                        </div>
                    </Card>
                </div>

                <div className="scroll-mt-10 text-xl">
                    <LineChart
                        className="h-72"
                        data={graphData}
                        index="date"
                        yAxisWidth={65}
                        categories={['Expenses', 'Deposits']}
                        colors={['indigo', 'cyan']}
                    />
                </div>
            </section>

            <section aria-labelledby="current-budget" className="max-w-xl md:max-w-4xl">
                <h1 className="scroll-mt-10 text-3xl">
                    Budgets
                </h1>
                <ul role="list" className="mt-4 space-5 min-w-48 flex flex-col gap-8 max-h-full md:max-h-28 w-full flex-wrap">
                    {
                        budgets.data.map((budget) => (
                            <li key={budget.id}>
                                <BudgetData title={budget.description} category={budget.category.title} value={budget.amount} max={budget.goal} />
                            </li>
                        ))
                    }
                </ul>
            </section>
        </main>
    );
}
