"use client";

import Button from "@/components/buttons/button";
import Modal from "@/components/modals/modal";
import useSwitch from "@/lib/hooks/useSwitch";
import { Account, Category, Transaction, TransactionStatus } from "@prisma/client";
import { DatePicker, DateRangePicker, NumberInput, Select, SelectItem, TextInput } from "@tremor/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaAnglesLeft, FaAnglesRight, FaArrowsLeftRight, FaEquals, FaGreaterThan, FaLessThan, FaAngleLeft, FaAngleRight, FaWandMagic, FaTrashCan } from "react-icons/fa6";

type FilterDate = {
    from?: Date;
    to?: Date;
}

type TransactionData = {
    data: Transaction[],
    pagination: {
        nextUrl: string | null,
        prevUrl: string | null,
        total: number,
        current: number,
        pageSize: number
    }
}

export default function Transactions() {
    const [filterDate, setFilterDate] = useState<FilterDate>({
        from: undefined,
        to: undefined
    });
    const [filterCondition, setFilterCondition] = useState<string | undefined>(undefined);
    const [filterCostRange, setFilterCostRange] = useState<(number | undefined)[]>([undefined, undefined]);
    const [filterStatus, setFilterStatus] = useState<string | undefined>(undefined);

    const [transactionData, setTransactionData] = useState<TransactionData | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
    const [page, setPage] = useState(0);

    const [loading, setLoading] = useState(false);
    const createModalSwitch = useSwitch(false);
    const [createData, setCreateData] = useState({
        accountId: "",
        categoryId: "",
        status: "cleared",
        description: "",
        type: "income",
        amount: 0,
        date: new Date()
    });

    const createTransaction = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/v1/transaction`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(createData)
            });

            if (response.status !== 201) {
                toast.error("Failed to create transaction");
                return;
            }

            toast.success("Transaction created successfully");
            createModalSwitch.setFalse();
            fetchTransactions();
        } catch (error) {
            console.error(error);
            toast.error("Failed to create transaction, see console for more information");
        } finally {
            setLoading(false);
        }
    }

    const fetchCategories = async () => {
        try {
            const response = await fetch(`/api/v1/category/list`);
            if (response.status !== 200) {
                toast.error("Failed to fetch categories");
                return;
            }

            const data = await response.json();
            setCategories(data.data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch categories, see console for more information");
        }
    }

    const fetchAccounts = async () => {
        try {
            const response = await fetch(`/api/v1/account/list`);
            if (response.status !== 200) {
                toast.error("Failed to fetch categories");
                return;
            }

            const data = await response.json();
            setAccounts(data.data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch categories, see console for more information");
        }
    }

    const fetchTransactions = async () => {
        try {
            const response = await fetch(`/api/v1/transaction/list?page=${page}`);
            if (response.status !== 200) {
                toast.error("Failed to fetch transactions");
                return;
            }

            const data = await response.json();
            setTransactionData(data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch transactions, see console for more information");
        }
    }

    useEffect(() => {
        fetchCategories();
        fetchTransactions();
        fetchAccounts();
    }, [page]);

    const pageSize = transactionData?.pagination.pageSize || 0;
    return (
        <main className="w-full min-h-screen p-2 md:p-12">
            <section aria-labelledby="current-budget">
                <h1 className="scroll-mt-10 text-3xl">
                    Transactions
                </h1>

                <div className="space-y-2">
                    {/* Header */}
                    <div className="md:text-xs mt-4">
                        <ul className="flex flex-col xl:flex-row gap-2 bg-white xl:bg-none" id="dropdown_filters">
                            <li>
                                <button data-dropdown-toggle="dateRangeDropdown" className="rounded-md border border-gray-300 px-2 py-1.5 hover:bg-gray-50 outline outline-offset-2 outline-0 focus-visible:outline-2 outline-violet-500 flex gap-1 items-center min-w-full xl:min-w-fit">
                                    <span aria-hidden="true">
                                        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" aria-hidden="true" className="size-5 -ml-px shrink-0 transition sm:size-4">
                                            <path d="M11 11V5H13V11H19V13H13V19H11V13H5V11H11Z"></path>
                                        </svg>
                                    </span>
                                    Date
                                    {
                                        filterDate.from && filterDate.to ? (
                                            <>
                                                <div className="w-[1px] h-4 bg-gray-300"></div>
                                                <span className="text-violet-600 font-medium">
                                                    {filterDate.from.toLocaleDateString()} - {filterDate.to.toLocaleDateString()}
                                                </span>
                                            </>
                                        ) : (
                                            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" aria-hidden="true" className="size-5 shrink-0 text-gray-500 sm:size-4">
                                                <path d="M11.9999 13.1714L16.9497 8.22168L18.3639 9.63589L11.9999 15.9999L5.63599 9.63589L7.0502 8.22168L11.9999 13.1714Z"></path>
                                            </svg>
                                        )
                                    }
                                </button>
                            </li>
                            <li>
                                <button className="rounded-md border border-gray-300 px-2 py-1.5 hover:bg-gray-50 outline outline-offset-2 outline-0 focus-visible:outline-2 outline-violet-500 flex gap-1 items-center min-w-full xl:min-w-fit">
                                    <span aria-hidden="true">
                                        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" aria-hidden="true" className="size-5 -ml-px shrink-0 transition sm:size-4">
                                            <path d="M11 11V5H13V11H19V13H13V19H11V13H5V11H11Z"></path>
                                        </svg>
                                    </span>
                                    Account
                                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" aria-hidden="true" className="size-5 shrink-0 text-gray-500 sm:size-4">
                                        <path d="M11.9999 13.1714L16.9497 8.22168L18.3639 9.63589L11.9999 15.9999L5.63599 9.63589L7.0502 8.22168L11.9999 13.1714Z"></path>
                                    </svg>
                                </button>
                            </li>
                            <li>
                                <button className="rounded-md border border-gray-300 px-2 py-1.5 hover:bg-gray-50 outline outline-offset-2 outline-0 focus-visible:outline-2 outline-violet-500 flex gap-1 items-center min-w-full xl:min-w-fit">
                                    <span aria-hidden="true">
                                        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" aria-hidden="true" className="size-5 -ml-px shrink-0 transition sm:size-4">
                                            <path d="M11 11V5H13V11H19V13H13V19H11V13H5V11H11Z"></path>
                                        </svg>
                                    </span>
                                    Category
                                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" aria-hidden="true" className="size-5 shrink-0 text-gray-500 sm:size-4">
                                        <path d="M11.9999 13.1714L16.9497 8.22168L18.3639 9.63589L11.9999 15.9999L5.63599 9.63589L7.0502 8.22168L11.9999 13.1714Z"></path>
                                    </svg>
                                </button>
                            </li>
                            <li>
                                <button data-dropdown-toggle="statusDropdown" className="rounded-md border border-gray-300 px-2 py-1.5 hover:bg-gray-50 outline outline-offset-2 outline-0 focus-visible:outline-2 outline-violet-500 flex gap-1 items-center min-w-full xl:min-w-fit">
                                    <span aria-hidden="true">
                                        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" aria-hidden="true" className="size-5 -ml-px shrink-0 transition sm:size-4">
                                            <path d="M11 11V5H13V11H19V13H13V19H11V13H5V11H11Z"></path>
                                        </svg>
                                    </span>
                                    Status
                                    {
                                        filterStatus ? (
                                            <>
                                                <div className="w-[1px] h-4 bg-gray-300"></div>
                                                <span className="text-violet-600 font-medium">
                                                    {filterStatus}
                                                </span>
                                            </>
                                        ) : (
                                            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" aria-hidden="true" className="size-5 shrink-0 text-gray-500 sm:size-4">
                                                <path d="M11.9999 13.1714L16.9497 8.22168L18.3639 9.63589L11.9999 15.9999L5.63599 9.63589L7.0502 8.22168L11.9999 13.1714Z"></path>
                                            </svg>
                                        )
                                    }
                                </button>
                            </li>
                            <li>
                                <button data-dropdown-toggle="costDropdown" className="rounded-md border border-gray-300 px-2 py-1.5 hover:bg-gray-50 outline outline-offset-2 outline-0 focus-visible:outline-2 outline-violet-500 flex gap-1 items-center min-w-full xl:min-w-fit">
                                    <span aria-hidden="true">
                                        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" aria-hidden="true" className="size-5 -ml-px shrink-0 transition sm:size-4">
                                            <path d="M11 11V5H13V11H19V13H13V19H11V13H5V11H11Z"></path>
                                        </svg>
                                    </span>
                                    Cost
                                    {
                                        filterCondition ? (
                                            <>
                                                <div className="w-[1px] h-4 bg-gray-300"></div>
                                                {
                                                    filterCondition != "is between" ? (
                                                        <span className="text-violet-600 font-medium">
                                                            {filterCondition} ${filterCostRange[0] ?? 0}
                                                        </span>
                                                    ) : (
                                                        <span className="text-violet-600 font-medium">
                                                            {filterCondition} ${filterCostRange[0] ?? 0} and ${filterCostRange[1] ?? 0}
                                                        </span>
                                                    )
                                                }
                                            </>
                                        ) : (
                                            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" aria-hidden="true" className="size-5 shrink-0 text-gray-500 sm:size-4">
                                                <path d="M11.9999 13.1714L16.9497 8.22168L18.3639 9.63589L11.9999 15.9999L5.63599 9.63589L7.0502 8.22168L11.9999 13.1714Z"></path>
                                            </svg>
                                        )
                                    }
                                </button>
                            </li>
                            <li className="relative z-10">
                                <input type="search" className="block w-full appearance-none rounded-md border px-2.5 py-1 outline-none transition sm:text-sm border-transparent text-gray-900 placeholder-gray-400 bg-gray-100 focus:ring-2 focus:ring-violet-200 focus:border-violet-500 [&::--webkit-search-cancel-button]:hidden [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden pl-8" placeholder="Search by description" />
                                <div className="pointer-events-none absolute bottom-0 left-2 flex h-full items-center justify-center text-gray-400">
                                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" aria-hidden="true" className="size-[1.125rem] shrink-0">
                                        <path d="M18.031 16.6168L22.3137 20.8995L20.8995 22.3137L16.6168 18.031C15.0769 19.263 13.124 20 11 20C6.032 20 2 15.968 2 11C2 6.032 6.032 2 11 2C15.968 2 20 6.032 20 11C20 13.124 19.263 15.0769 18.031 16.6168ZM16.0247 15.8748C17.2475 14.6146 18 12.8956 18 11C18 7.1325 14.8675 4 11 4C7.1325 4 4 7.1325 4 11C4 14.8675 7.1325 18 11 18C12.8956 18 14.6146 17.2475 15.8748 16.0247L16.0247 15.8748Z"></path>
                                    </svg>
                                </div>
                            </li>
                            <li className="ml-auto hidden xl:flex">
                                <button disabled={categories.length <= 0} className="rounded-md border border-gray-300 px-2 py-1.5 hover:bg-gray-50 outline outline-offset-2 outline-0 focus-visible:outline-2 outline-violet-500 flex gap-1 items-center disabled:opacity-50" onClick={createModalSwitch.setTrue}>
                                    <span aria-hidden="true">
                                        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" aria-hidden="true" className="size-5 -ml-px shrink-0 transition sm:size-4">
                                            <path d="M11 11V5H13V11H19V13H13V19H11V13H5V11H11Z"></path>
                                        </svg>
                                    </span>
                                    Add
                                </button>
                            </li>
                        </ul>
                    </div>

                    {/* Table */}
                    <div className="overflow-hidden overflow-x-auto">
                        <table className="caption-bottom border-b border-gray-200 w-full">
                            <thead>
                                <tr className="[&_td:last-child]:pr-4 [&_th:last-child]:pr-4 [&_td:first-child]:pl-4 [&_th:first-child]:pl-4 border-y border-gray-200">
                                    <th className="border-b px-4 text-left font-semibold text-gray-900 border-gray-200 whitespace-nowrap py-1 text-sm">
                                        Account
                                    </th>
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
                                    <th className="border-b px-4 text-left font-semibold text-gray-900 border-gray-200 whitespace-nowrap py-1 text-sm max-w-5">
                                        Edit
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    transactionData?.data.map((transaction) => {
                                        return (
                                            <tr className="border-b border-gray-200" key={transaction.id}>
                                                <td className="px-4 py-2 text-xs md:text-sm text-blue-500 hover:text-blue-600">
                                                    <Link href={`/accounts/${transaction.accountId}`}>{accounts.find(x => x.id == transaction.accountId)?.name} ({accounts.find(x => x.id == transaction.accountId)?.type})</Link>
                                                </td>
                                                <td className="px-4 py-2 text-xs md:text-sm text-blue-500 hover:text-blue-600">
                                                    <Link href={`/categories/${transaction.categoryId}`}>{categories.find(x => x.id == transaction.categoryId)?.title}</Link>
                                                </td>
                                                <td className="px-4 py-2 text-xs md:text-sm">
                                                    {transaction.status == TransactionStatus.CLEARED ? (
                                                        <span className="whitespace-nowrap rounded text-xs ring-1 bg-emerald-50 text-emerald-800 px-1.5 py-0.5 ring-emerald-600/30">
                                                            Cleared
                                                        </span>
                                                    ) : transaction.status == TransactionStatus.PENDING ? (
                                                        <span className="whitespace-nowrap rounded text-xs ring-1 bg-yellow-50 text-yellow-800 px-1.5 py-0.5 ring-yellow-600/30">
                                                            Pending
                                                        </span>
                                                    ) : (
                                                        <span className="whitespace-nowrap rounded text-xs ring-1 bg-red-50 text-red-800 px-1.5 py-0.5 ring-red-600/30">
                                                            Cancelled
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
                                                    {new Date(transaction.date).toLocaleDateString()}
                                                </td>
                                                <td className="px-4 py-2 text-xs md:text-sm max-w-5">
                                                    <button id={`btn_${transaction.id}`} className="rounded-md whitespace-nowrap text-center transition-all duration-200 ease-in-out focus-visible:outline-2 outline-violet-500 border-gray-300 p-1.5 border hover:bg-gray-100 border-opacity-0 hover:border-opacity-100" onClick={() => {
                                                        setSelectedTransaction(transaction);
                                                    }}>
                                                        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" aria-hidden="true" className="remixicon size-4 shrink-0 text-gray-500 group-hover:text-gray-700 group-data-[state=open]:text-gray-700">
                                                            <path d="M5 10C3.9 10 3 10.9 3 12C3 13.1 3.9 14 5 14C6.1 14 7 13.1 7 12C7 10.9 6.1 10 5 10ZM19 10C17.9 10 17 10.9 17 12C17 13.1 17.9 14 19 14C20.1 14 21 13.1 21 12C21 10.9 20.1 10 19 10ZM12 10C10.9 10 10 10.9 10 12C10 13.1 10.9 14 12 14C13.1 14 14 13.1 14 12C14 10.9 13.1 10 12 10Z"></path>
                                                        </svg>
                                                    </button>
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                    </div>

                    {/* Footer */}
                    <div className={`w-full flex-row justify-between sm:justify-end items-center gap-8 ${transactionData ? 'flex' : 'hidden'}`}>
                        <p className="flex text-sm tabular-nums text-gray-500 gap-1">
                            Showing
                            <span className="font-medium text-gray-900">
                                {
                                    ((transactionData?.pagination.total || 0) > 0 ? (transactionData?.pagination.current || 0) * pageSize + 1 : 0)
                                }-{Math.min((transactionData?.pagination.current || 0) * pageSize + pageSize, transactionData?.pagination.total || 0)}
                            </span>
                            of
                            <span className="font-medium text-gray-900">
                                {transactionData?.pagination.total || 0}
                            </span>
                        </p>
                        <div className="flex items-center gap-x-1.5">
                            <button
                                onClick={() => setPage(0)}
                                className="rounded-md whitespace-nowrap text-center transition-all duration-200 ease-in-out focus-visible:outline-2 outline-violet-500 border-gray-300 p-1.5 border hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-transparent" disabled={transactionData?.pagination.prevUrl == null}>
                                <FaAnglesLeft />
                            </button>
                            <button
                                onClick={() => setPage(page - 1)}
                                className="rounded-md whitespace-nowrap text-center transition-all duration-200 ease-in-out focus-visible:outline-2 outline-violet-500 border-gray-300 p-1.5 border hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-transparent" disabled={transactionData?.pagination.prevUrl == null}>
                                <FaAngleLeft />
                            </button>
                            <button
                                onClick={() => setPage(page + 1)}
                                className="rounded-md whitespace-nowrap text-center transition-all duration-200 ease-in-out focus-visible:outline-2 outline-violet-500 border-gray-300 p-1.5 border hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-transparent" disabled={transactionData?.pagination.nextUrl == null}>
                                <FaAngleRight />
                            </button>
                            <button
                                onClick={() => setPage(Math.floor((transactionData?.pagination.total || 0) / Math.max(pageSize, 1)))}
                                className="rounded-md whitespace-nowrap text-center transition-all duration-200 ease-in-out focus-visible:outline-2 outline-violet-500 border-gray-300 p-1.5 border hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-transparent" disabled={transactionData?.pagination.nextUrl == null}>
                                <FaAnglesRight />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Dropdowns */}
                <div id="dateRangeDropdown" className="z-10 bg-white rounded-md shadow-lg p-2 border border-gray-300 hidden items-center">
                    <label className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">Select date range</label>
                    <DateRangePicker className="mx-auto max-w-md bg-white" enableSelect={false} enableClear={true} value={filterDate} onValueChange={(e) => {
                        setFilterDate({
                            from: e.from,
                            to: e.to
                        })
                    }} />
                </div>

                <div id="costDropdown" className="z-10 bg-white rounded-md shadow-lg p-2 border border-gray-300 hidden items-center">
                    <div className="flex flex-col gap-1">
                        <div>
                            <label htmlFor="distance" className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">Select condition</label>
                            <Select className="mx-auto max-w-md bg-white" id="condition" name="condition" value={filterCondition} onValueChange={(e) => {
                                setFilterCondition(e);
                            }}>
                                <SelectItem value="is equal to" icon={FaEquals}>
                                    is equal to
                                </SelectItem>
                                <SelectItem value="is between" icon={FaArrowsLeftRight}>
                                    is between
                                </SelectItem>
                                <SelectItem value="is greater than" icon={FaGreaterThan}>
                                    is greater than
                                </SelectItem>
                                <SelectItem value="is less than" icon={FaLessThan}>
                                    is less than
                                </SelectItem>
                            </Select>
                        </div>
                        <div className="flex gap-2 items-center p-1">
                            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" aria-hidden="true" className="remixicon size-5 shrink-0 text-gray-500">
                                <path d="M4.99989 13.9999L4.99976 5L6.99976 4.99997L6.99986 11.9999L17.1717 12L13.222 8.05024L14.6362 6.63603L21.0001 13L14.6362 19.364L13.222 17.9497L17.1717 14L4.99989 13.9999Z"></path>
                            </svg>
                            {
                                filterCondition == "is between" ? (
                                    <div className="flex items-center gap-2">
                                        <NumberInput placeholder="$0" className="max-w-12" enableStepper={false} onValueChange={(e) => setFilterCostRange([e, filterCostRange[1]])} />
                                        <span className="text-gray-500">and</span>
                                        <NumberInput placeholder="$0" className="max-w-12" enableStepper={false} onValueChange={(e) => setFilterCostRange([filterCostRange[0], e])} />
                                    </div>
                                ) : (
                                    <NumberInput placeholder="$0" className="max-w-12" enableStepper={false} onValueChange={(e) => setFilterCostRange([e, e])} />
                                )
                            }
                        </div>
                    </div>
                </div>

                <div id="statusDropdown" className="z-10 bg-white rounded-md shadow-lg p-2 border border-gray-300 hidden items-center">
                    <label className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">Select status</label>
                    <Select className="mx-auto max-w-md bg-white" id="condition" name="condition" value={filterStatus} onValueChange={(e) => {
                        setFilterStatus(e);
                    }}>
                        <SelectItem value="cleared" icon={FaEquals}>
                            Cleared
                        </SelectItem>
                        <SelectItem value="pending" icon={FaEquals}>
                            Pending
                        </SelectItem>
                        <SelectItem value="cancelled" icon={FaEquals}>
                            Cancelled
                        </SelectItem>
                    </Select>
                </div>

                <Modal isOpen={createModalSwitch.state} onClose={createModalSwitch.setFalse} title="Create Transaction" footer={
                        <div className="flex justify-start gap-2">
                            <Button color="violet" size="sm" title="Create" onClick={createTransaction} loading={loading} disabled={loading} />
                            <Button color="slate" size="sm" title="Cancel" onClick={createModalSwitch.setFalse} disabled={loading} />
                        </div>
                    }>
                        <div>
                            <label htmlFor="account" className="block text-sm font-medium text-gray-700">
                                Account
                            </label>
                            <Select id="account" name="account" value={createData.accountId} onValueChange={(e) => setCreateData({ ...createData, accountId: e })}>
                                {
                                    accounts.map((account) => {
                                        return (
                                            <SelectItem key={account.id} value={account.id}>
                                                {account.name} ({account.type})
                                            </SelectItem>
                                        )
                                    })
                                }
                            </Select>
                        </div>
                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                                Category
                            </label>
                            <Select id="category" name="category" value={createData.categoryId} onValueChange={(e) => setCreateData({ ...createData, categoryId: e })}>
                                {
                                    categories.map((category) => {
                                        return (
                                            <SelectItem key={category.id} value={category.id}>
                                                {category.title}
                                            </SelectItem>
                                        )
                                    })
                                }
                            </Select>
                        </div>
                        <div>
                            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                                Status
                            </label>
                            <Select id="status" name="status" value={createData.status} onValueChange={(e) => setCreateData({ ...createData, status: e })}>
                                <SelectItem value="cleared">
                                    Cleared
                                </SelectItem>
                                <SelectItem value="pending">
                                    Pending
                                </SelectItem>
                                <SelectItem value="cancelled">
                                    Cancelled
                                </SelectItem>
                            </Select>
                        </div>
                        <div>
                            <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                                Type
                            </label>
                            <Select id="type" name="type" value={createData.type} onValueChange={(e) => setCreateData({ ...createData, type: e })}>
                                <SelectItem value="income">
                                    Income
                                </SelectItem>
                                <SelectItem value="expense">
                                    Expense
                                </SelectItem>
                            </Select>
                        </div>
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                Description
                            </label>
                            <TextInput id="description" name="description" placeholder="Description" value={createData.description} onValueChange={(e) => setCreateData({ ...createData, description: e })} />
                        </div>
                        <div>
                            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                                Amount
                            </label>
                            <NumberInput id="amount" name="amount" value={createData.amount} onValueChange={(e) => setCreateData({ ...createData, amount: e })} enableStepper={false} />
                        </div>
                        <div>
                            <label htmlFor="Date" className="block text-sm font-medium text-gray-700">
                                Date
                            </label>
                            <DatePicker id="date" value={createData.date} onValueChange={(e) => setCreateData({ ...createData, date: new Date(e?.toUTCString() ?? new Date().toUTCString()) })} />
                        </div>
                    </Modal>
            </section>
        </main>
    );
}
