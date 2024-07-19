"use client";

import { Account, AccountType, Transaction } from "@prisma/client";
import { Card, LineChart, ProgressBar } from "@tremor/react";
import dayjs from "dayjs";
import { useQuery } from "@tanstack/react-query";
import { getAccountDashboardData, getAccountData } from "@/lib/api/accounts";
import FullLoading from "@/molecules/feedback/FullLoading";
import FullError from "@/molecules/feedback/FullError";

type AccountDashboardData = {
    income: number;
    expenses: number;
    incomeMapByDay: Record<number, number>;
    expenseMapByDay: Record<number, number>;
    recentTransactions: Transaction[];
}

const valueFormatter = function (n: number) {
    return '$ ' + new Intl.NumberFormat('us').format(n).toString();
};

export default function AccountPage({ params }: { params: { accountID: string } }) {
    const accountQuery = useQuery({ queryKey: ["account", { accountId: params.accountID }], queryFn: getAccountData });
    const dashboardQuery = useQuery({ queryKey: ["accountDashboard", { accountId: params.accountID }], queryFn: getAccountDashboardData });

    if (accountQuery.isPending || dashboardQuery.isPending) {
        return <FullLoading injectMain />;
    }

    if (accountQuery.isError || dashboardQuery.isError) {
        return <FullError injectMain error={accountQuery.error ?? dashboardQuery.error} />;
    }

    const account = accountQuery.data as Account;
    const dashboardData = dashboardQuery.data as AccountDashboardData;

    const balance = Math.abs(account.balance);
    const percentageOfLimit = balance / (account.creditLimit ?? 1) * 100;
    const incomePercentage = dashboardData?.income / (dashboardData?.income + dashboardData?.expenses) * 100;
    const expensesPercentage = dashboardData?.expenses / (dashboardData?.income + dashboardData?.expenses) * 100;

    const dayNumToDisplayDate = (dayNum: number) => {
        return dayjs(new Date(new Date().getFullYear(), new Date().getMonth(), dayNum)).format('MMMM DD');
    }

    const graphData = Array.from({ length: dayjs().date() }, (_, i) => {
        const date = i + 1;
        return {
            date: dayNumToDisplayDate(date),
            Expenses: dashboardData?.expenseMapByDay[date] ?? 0,
            Deposits: dashboardData?.incomeMapByDay[date] ?? 0
        }
    });

    const today = new Date().getDate();
    for (let i = 1; i <= today; i++) {
        if (graphData.findIndex((d: any) => d.date === dayNumToDisplayDate(i)) === -1) {
            graphData.push({
                date: dayNumToDisplayDate(i),
                Expenses: 0,
                Deposits: 0
            });
        }
    }

    graphData.sort((a, b) => {
        return dayjs(a.date).unix() - dayjs(b.date).unix();
    });

    return (
        <main className="w-full min-h-screen p-2 md:p-12">
            <section className="flex flex-col gap-4">
                <h1 className="scroll-mt-10 text-3xl">
                    {account.name}
                </h1>

                <div className="scroll-mt-10 flex gap-4 flex-wrap">
                    {
                        account.type == AccountType.CREDIT && (
                            <Card className="max-w-md">
                                <h4 className="text-tremor-default text-tremor-content">
                                    Balance
                                </h4>
                                <div className="flex gap-2 items-center">
                                    <p className="font-semibold text-2xl">
                                        ${balance.toFixed(2)}
                                    </p>
                                    <span className="text-lg">
                                        /
                                    </span>
                                    <p className="font-semibold text-2xl">
                                        ${account.creditLimit?.toFixed(2)}
                                    </p>
                                </div>
                                <p className="mt-4 flex items-center justify-between text-tremor-default text-tremor-content dark:text-dark-tremor-content">
                                    <span>{percentageOfLimit.toFixed(1)}% of limit</span>
                                    <span>${account.creditLimit?.toFixed(2)}</span>
                                </p>
                                <ProgressBar value={percentageOfLimit} className="mt-2" />
                            </Card>
                        )
                    }
                    {
                        account.type !== AccountType.CREDIT && (
                            <Card className="max-w-md flex flex-col justify-between gap-2">
                                <div>
                                    <h4 className="text-tremor-default text-tremor-content">
                                        Balance
                                    </h4>
                                    <p className="font-semibold text-2xl">
                                        ${account.balance.toFixed(2)}
                                    </p>
                                </div>
                                <div>
                                    <h4 className="text-tremor-default text-tremor-content">
                                        Pending Balance
                                    </h4>
                                    <p className="font-semibold text-2xl">
                                        ${account.pendingBalance.toFixed(2)}
                                    </p>
                                </div>
                            </Card>
                        )
                    }
                    <Card className="max-w-md">
                        <h4 className="text-tremor-default text-tremor-content">
                            Income vs Expenses
                        </h4>
                        <div className="flex gap-2 items-center">
                            <p className="font-semibold text-2xl">
                                ${dashboardData?.income.toFixed(2) ?? 0}
                            </p>
                            <span className="text-lg">
                                vs
                            </span>
                            <p className="font-semibold text-2xl">
                                ${dashboardData?.expenses.toFixed(2) ?? 0}
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
                    <h2 className="-mb-8">
                        Trend
                    </h2>

                    <LineChart
                        className="h-72"
                        data={graphData}
                        index="date"
                        yAxisWidth={65}
                        categories={['Expenses', 'Deposits']}
                        colors={['indigo', 'cyan']}
                        valueFormatter={valueFormatter}
                    />
                </div>

                <div className="scroll-mt-10 text-xl">
                    <h2 className="mb-2">
                        Recent Activity
                    </h2>

                    <div className="overflow-hidden overflow-x-auto">
                        <table className="caption-bottom border-b border-gray-200 w-full">
                            <thead>
                                <tr className="[&_td:last-child]:pr-4 [&_th:last-child]:pr-4 [&_td:first-child]:pl-4 [&_th:first-child]:pl-4 border-y border-gray-200">
                                    <th className="border-b px-4 text-left font-semibold text-gray-900 border-gray-200 whitespace-nowrap py-1 text-sm">
                                        Category
                                    </th>
                                    <th className="border-b px-4 text-left font-semibold text-gray-900 border-gray-200 whitespace-nowrap py-1 text-sm">
                                        Status
                                    </th>
                                    <th className="border-b px-4 text-left font-semibold text-gray-900 border-gray-200 whitespace-nowrap py-1 text-sm">
                                        Description
                                    </th>
                                    <th className="border-b px-4 text-left font-semibold text-gray-900 border-gray-200 whitespace-nowrap py-1 text-sm">
                                        Amount
                                    </th>
                                    <th className="border-b px-4 text-left font-semibold text-gray-900 border-gray-200 whitespace-nowrap py-1 text-sm">
                                        Date
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    dashboardData.recentTransactions.map((transaction, index) => (
                                        <tr className="border-b border-gray-200" key={index}>
                                            <td className="px-4 py-2 text-xs md:text-sm">
                                                {(transaction as any).category.title}
                                            </td>
                                            <td className="px-4 py-2 text-xs md:text-sm">
                                                {transaction.status === 'CLEARED' ? (
                                                    <span className="whitespace-nowrap rounded text-xs ring-1 bg-emerald-50 text-emerald-800 px-1.5 py-0.5 ring-emerald-600/30">
                                                        Cleared
                                                    </span>
                                                ) : (
                                                    <span className="whitespace-nowrap rounded text-xs ring-1 bg-yellow-50 text-yellow-800 ring-yellow-600/30 px-1.5 py-0.5">
                                                        Pending
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-4 py-2 text-xs md:text-sm">
                                                {transaction.description}
                                            </td>
                                            <td className="px-4 py-2 text-xs md:text-sm">
                                                ${transaction.amount.toFixed(2)}
                                            </td>
                                            <td className="px-4 py-2 text-xs md:text-sm">
                                                {dayjs(transaction.date).format('MMM D, YYYY')}
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        </main>
    );
}
