"use client";

import { Card, DateRangePicker, LineChart, NumberInput, ProgressBar, Select, SelectItem } from "@tremor/react";
import { useState } from "react";
import { FaAnglesLeft, FaAnglesRight, FaArrowsLeftRight, FaEquals, FaGreaterThan, FaLessThan, FaAngleLeft, FaAngleRight } from "react-icons/fa6";

type TransactionEntry = {
    id: string;
    date: string;
    description: string;
    amount: number;
    status: string;
    account: string;
}

type FilterDate = {
    from?: Date;
    to?: Date;
}

const chartdata = [
    {
        date: 'Jan 22',
        Expenses: 2890,
        Deposits: 2338,
    },
    {
        date: 'Feb 22',
        Expenses: 2756,
        Deposits: 2103,
    },
    {
        date: 'Mar 22',
        Expenses: 3322,
        Deposits: 2194,
    },
    {
        date: 'Apr 22',
        Expenses: 3470,
        Deposits: 2108,
    },
    {
        date: 'May 22',
        Expenses: 3475,
        Deposits: 1812,
    },
    {
        date: 'Jun 22',
        Expenses: 3129,
        Deposits: 1726,
    },
    {
        date: 'Jul 22',
        Expenses: 3490,
        Deposits: 1982,
    },
    {
        date: 'Aug 22',
        Expenses: 2903,
        Deposits: 2012,
    },
    {
        date: 'Sep 22',
        Expenses: 2643,
        Deposits: 2342,
    },
    {
        date: 'Oct 22',
        Expenses: 2837,
        Deposits: 2473,
    },
    {
        date: 'Nov 22',
        Expenses: 2954,
        Deposits: 3848,
    },
    {
        date: 'Dec 22',
        Expenses: 3239,
        Deposits: 3736,
    },
]

const valueFormatter = function (n: number) {
    return '$ ' + new Intl.NumberFormat('us').format(n).toString();
};

export default function Transactions() {
    return (
        <main className="w-full min-h-screen p-2 md:p-12">
            <section aria-labelledby="current-budget" className="flex flex-col gap-4">
                <h1 className="scroll-mt-10 text-3xl">
                    USAA Debit
                </h1>

                <div className="scroll-mt-10 flex gap-4 flex-wrap">
                    <Card className="max-w-md">
                        <h4 className="text-tremor-default text-tremor-content">
                            Balance
                        </h4>
                        <p className="font-semibold text-2xl">
                            $71,465
                        </p>
                    </Card>
                    <Card className="max-w-md">
                        <h4 className="text-tremor-default text-tremor-content">
                            Income vs Expenses
                        </h4>
                        <div className="flex gap-2 items-center">
                            <p className="font-semibold text-2xl">
                                $1,465
                            </p>
                            <span className="text-lg">
                                vs
                            </span>
                            <p className="font-semibold text-2xl">
                                $1,465
                            </p>
                        </div>
                    </Card>
                    <Card className="max-w-md">
                        <h4 className="text-tremor-default text-tremor-content">
                            Balance
                        </h4>
                        <div className="flex gap-2 items-center">
                            <p className="font-semibold text-2xl">
                                $483.35
                            </p>
                            <span className="text-lg">
                                /
                            </span>
                            <p className="font-semibold text-2xl">
                                $3,0000.00
                            </p>
                        </div>
                        <p className="mt-4 flex items-center justify-between text-tremor-default text-tremor-content dark:text-dark-tremor-content">
                            <span>32% of limit</span>
                            <span>$3000.00</span>
                        </p>
                        <ProgressBar value={32} className="mt-2" />
                    </Card>
                </div>

                <div className="scroll-mt-10 text-xl">
                    <h2 className="-mb-8">
                        Trend
                    </h2>

                    <LineChart
                        className="h-72"
                        data={chartdata}
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
                                    <th className="border-b px-4 text-left font-semibold text-gray-900 border-gray-200 whitespace-nowrap py-1 text-sm">
                                        Edit
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    Array.from({ length: 5 }).map((_, index) => (
                                        <tr className="border-b border-gray-200" key={index}>
                                            <td className="px-4 py-2 text-xs md:text-sm">
                                                Groceries
                                            </td>
                                            <td className="px-4 py-2 text-xs md:text-sm">
                                                {index % 2 == 0 ? (
                                                    <span className="whitespace-nowrap rounded text-xs ring-1 bg-emerald-50 text-emerald-800 px-1.5 py-0.5 ring-emerald-600/30">
                                                        Confirmed
                                                    </span>
                                                ) : (
                                                    <span className="whitespace-nowrap rounded text-xs ring-1 bg-yellow-50 text-yellow-800 ring-yellow-600/30 px-1.5 py-0.5">
                                                        Pending
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-4 py-2 text-xs md:text-sm">
                                                Payment for groceries
                                            </td>
                                            <td className="px-4 py-2 text-xs md:text-sm">
                                                $50.00
                                            </td>
                                            <td className="px-4 py-2 text-xs md:text-sm">
                                                2021-12-01
                                            </td>
                                            <td className="px-4 py-2 text-xs md:text-sm">
                                                <button className="rounded-md whitespace-nowrap text-center transition-all duration-200 ease-in-out focus-visible:outline-2 outline-violet-500 border-gray-300 p-1.5 border hover:bg-gray-100 border-opacity-0 hover:border-opacity-100" data-dropdown-toggle={`row_dropdown_${index}`}>
                                                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" aria-hidden="true" className="remixicon size-4 shrink-0 text-gray-500 group-hover:text-gray-700 group-data-[state=open]:text-gray-700">
                                                        <path d="M5 10C3.9 10 3 10.9 3 12C3 13.1 3.9 14 5 14C6.1 14 7 13.1 7 12C7 10.9 6.1 10 5 10ZM19 10C17.9 10 17 10.9 17 12C17 13.1 17.9 14 19 14C20.1 14 21 13.1 21 12C21 10.9 20.1 10 19 10ZM12 10C10.9 10 10 10.9 10 12C10 13.1 10.9 14 12 14C13.1 14 14 13.1 14 12C14 10.9 13.1 10 12 10Z"></path>
                                                    </svg>
                                                </button>
                                                <div id={`row_dropdown_${index}`} className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700">
                                                    <ul className="p-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
                                                        <li>
                                                            <button className="block px-4 py-2 hover:bg-gray-100 rounded-lg w-full text-left">Edit</button>
                                                        </li>
                                                        <li>
                                                            <button className="block px-4 py-2 hover:bg-gray-100 text-red-600 rounded-lg w-full text-left">Delete</button>
                                                        </li>
                                                    </ul>
                                                </div>
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
