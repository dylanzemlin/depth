"use client";

import FullError from "@/molecules/feedback/FullError";
import FullLoading from "@/molecules/feedback/FullLoading";
import { getAccounts } from "@/lib/api/accounts";
import { getCategories } from "@/lib/api/categories";
import { classNames } from "@/lib/classnames";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { NumberInput, Select, SelectItem } from "@tremor/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaArrowsLeftRight, FaEquals, FaGreaterThan, FaLessThan, FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import TableFilter from "@/molecules/tables/filter";
import { Table, TableBody, TableBodyCell, TableFilters, TableFooter, TableHead, TableHeadCell, TableRow } from "@/molecules/table";
import { useDebounce } from 'use-debounce';
import CreateSubscriptionModal from "@/organisms/subscriptions/createSubscriptionModal";
import EditSubscriptionModal from "@/organisms/subscriptions/editSubscriptionModal";
import DeleteSubscriptionModal from "@/organisms/subscriptions/deleteSubscriptionModal";
import { getTransfers, TransferFilter, TransferType } from "@/lib/api/transfers";
import CreateTransferModal from "@/organisms/transfers/createTransferModal";
import EditTransferModal from "@/organisms/transfers/editTransferModal";
import DeleteTransferModal from "@/organisms/transfers/deleteTransferModal";
import { TransferStatus } from "@prisma/client";
import { DateTime } from "luxon";

export default function Transfers() {
    const [page, setPage] = useState(0);
    const [selectedTransfer, setSelectedTransfer] = useState<TransferType | null>(null);

    const [transferFilter, setTransferFilter] = useState<TransferFilter>({});
    const transferQuery = useInfiniteQuery({
        queryKey: ["transfers", { filter: transferFilter }],
        queryFn: getTransfers,
        getNextPageParam: (lastPage) => lastPage.pagination.nextUrl ? lastPage.pagination.current + 1 : undefined,
        getPreviousPageParam: (lastPage) => lastPage.pagination.prevUrl ? lastPage.pagination.current - 1 : undefined,
        initialPageParam: 0
    });
    const accountQuery = useQuery({ queryKey: ["accounts"], queryFn: getAccounts });
    const categoryQuery = useQuery({ queryKey: ["categories"], queryFn: getCategories });

    const [description, setDescription] = useState("");
    const [value] = useDebounce(description, 500);
    useEffect(() => {
        setTransferFilter({ ...transferFilter, description: value });
    }, [value]);

    if (accountQuery.isPending || categoryQuery.isPending) {
        return <FullLoading injectMain />
    }

    if (transferQuery.isError || accountQuery.isError || categoryQuery.isError) {
        return <FullError injectMain error={transferQuery.error || accountQuery.error || categoryQuery.error} />
    }

    const pageData = transferQuery.data?.pages[page];
    const transfers = pageData?.data;
    const tPagination = pageData?.pagination;
    const accounts = accountQuery.data.data;
    const categories = categoryQuery.data.data;

    const pageSize = tPagination?.pageSize || 0;
    return (
        <main className="w-full min-h-screen p-2 md:p-12">
            <section aria-labelledby="current-budget">
                <h1 className="scroll-mt-10 text-3xl">
                    Transfers
                </h1>

                <div className="space-y-2 mt-4">
                    {
                        <Table>
                            <TableHead>
                                <TableHeadCell>From</TableHeadCell>
                                <TableHeadCell>To</TableHeadCell>
                                <TableHeadCell>Category</TableHeadCell>
                                <TableHeadCell>Status</TableHeadCell>
                                <TableHeadCell>Description</TableHeadCell>
                                <TableHeadCell>Amount</TableHeadCell>
                                <TableHeadCell>Date</TableHeadCell>
                                <TableHeadCell>Edit</TableHeadCell>
                            </TableHead>
                            <TableBody>
                                {
                                    (!transferQuery.isPending) ? transfers?.map((transfer) => {
                                        return (
                                            <TableRow key={transfer.id}>
                                                <TableBodyCell isLink>
                                                    <Link href={`/accounts/${transfer.fromAccount.id}`}>{transfer.fromAccount.name} ({transfer.fromAccount.type})</Link>
                                                </TableBodyCell>
                                                <TableBodyCell isLink>
                                                    <Link href={`/accounts/${transfer.toAccount.id}`}>{transfer.toAccount.name} ({transfer.toAccount.type})</Link>
                                                </TableBodyCell>
                                                <TableBodyCell>
                                                    {transfer.category.title}
                                                </TableBodyCell>
                                                <TableBodyCell>
                                                    {transfer.status == TransferStatus.CLEARED ? (
                                                        <span className="whitespace-nowrap rounded text-xs ring-1 bg-emerald-50 text-emerald-800 px-1.5 py-0.5 ring-emerald-600/30">
                                                            Cleared
                                                        </span>
                                                    ) : transfer.status == TransferStatus.PENDING ? (
                                                        <span className="whitespace-nowrap rounded text-xs ring-1 bg-yellow-50 text-yellow-800 px-1.5 py-0.5 ring-yellow-600/30">
                                                            Pending
                                                        </span>
                                                    ) : (
                                                        <span className="whitespace-nowrap rounded text-xs ring-1 bg-red-50 text-red-800 px-1.5 py-0.5 ring-red-600/30">
                                                            Cancelled
                                                        </span>
                                                    )}
                                                </TableBodyCell>
                                                <TableBodyCell>
                                                    {transfer.description}
                                                </TableBodyCell>
                                                <TableBodyCell>
                                                    ${transfer.amount.toFixed(2)}
                                                </TableBodyCell>
                                                <TableBodyCell>
                                                    {DateTime.fromJSDate(transfer.date).toFormat("MMM d, yyyy")}
                                                </TableBodyCell>
                                                <TableBodyCell>
                                                    <Menu>
                                                        <div>
                                                            <MenuButton onClick={() => {
                                                                setSelectedTransfer(transfer)
                                                            }} className="rounded-md whitespace-nowrap text-center transition-all duration-200 ease-in-out focus-visible:outline-2 outline-indigo-500 border-gray-300 p-1.5 border hover:bg-gray-100 border-opacity-0 hover:border-opacity-100">
                                                                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" aria-hidden="true" className="remixicon size-4 shrink-0 text-gray-500 group-hover:text-gray-700 group-data-[state=open]:text-gray-700">
                                                                    <path d="M5 10C3.9 10 3 10.9 3 12C3 13.1 3.9 14 5 14C6.1 14 7 13.1 7 12C7 10.9 6.1 10 5 10ZM19 10C17.9 10 17 10.9 17 12C17 13.1 17.9 14 19 14C20.1 14 21 13.1 21 12C21 10.9 20.1 10 19 10ZM12 10C10.9 10 10 10.9 10 12C10 13.1 10.9 14 12 14C13.1 14 14 13.1 14 12C14 10.9 13.1 10 12 10Z"></path>
                                                                </svg>
                                                            </MenuButton>
                                                        </div>

                                                        <MenuItems anchor="bottom" transition className="absolute p-2 right-0 z-10 mt-2 w-32 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in">
                                                            <MenuItem>
                                                                {selectedTransfer && (
                                                                    <EditTransferModal button={
                                                                        <button className={classNames('hover:bg-gray-100 hover:text-gray-900 text-gray-700', 'block px-4 py-2 text-sm w-full rounded-md text-left')}>
                                                                            Edit
                                                                        </button>
                                                                    } transfer={selectedTransfer} accounts={accounts} categories={categories} />
                                                                )}
                                                            </MenuItem>
                                                            <MenuItem>
                                                                {selectedTransfer && (
                                                                    <DeleteTransferModal button={
                                                                        <button className={classNames('hover:bg-gray-100 text-red-500', 'block px-4 py-2 text-sm w-full rounded-md text-left')}>
                                                                            Delete
                                                                        </button>
                                                                    } transfer={selectedTransfer as any} />
                                                                )}
                                                            </MenuItem>
                                                        </MenuItems>
                                                    </Menu>
                                                </TableBodyCell>
                                            </TableRow>
                                        )
                                    }) : <FullLoading />
                                }
                            </TableBody>
                            <TableFooter>
                                <div className={`w-full flex-row justify-between sm:justify-end items-center gap-4 ${transferQuery.isSuccess ? 'flex' : 'hidden'}`}>
                                    <p className="flex text-sm tabular-nums text-gray-500 gap-1">
                                        Showing
                                        <span className="font-medium text-gray-900">
                                            {
                                                ((tPagination?.total || 0) > 0 ? (tPagination?.current || 0) * pageSize + 1 : 0)
                                            }-{Math.min((tPagination?.current || 0) * pageSize + pageSize, tPagination?.total || 0)}
                                        </span>
                                        of
                                        <span className="font-medium text-gray-900">
                                            {tPagination?.total || 0}
                                        </span>
                                    </p>
                                    <div className="flex items-center gap-x-1.5">
                                        <button
                                            onClick={() => {
                                                setPage(page - 1)
                                            }}
                                            className="rounded-md whitespace-nowrap text-center transition-all duration-200 ease-in-out focus-visible:outline-2 outline-indigo-500 border-gray-300 p-1.5 border hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-transparent"
                                            disabled={tPagination?.prevUrl == null}>
                                            <FaAngleLeft />
                                        </button>
                                        <button
                                            onClick={async () => {
                                                if (transferQuery.data?.pages && transferQuery.data.pages.length <= page + 1) {
                                                    await transferQuery.fetchNextPage();
                                                }

                                                setPage(page + 1);
                                            }}
                                            className="rounded-md whitespace-nowrap text-center transition-all duration-200 ease-in-out focus-visible:outline-2 outline-indigo-500 border-gray-300 p-1.5 border hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-transparent"
                                            disabled={tPagination?.nextUrl == null}>
                                            <FaAngleRight />
                                        </button>
                                    </div>
                                </div>
                            </TableFooter>
                            <TableFilters>
                                <TableFilter title="From Account" property={transferFilter.fromAccountId} display={accounts.find(x => x.id == transferFilter.fromAccountId)?.name + " (" + accounts.find(x => x.id == transferFilter.fromAccountId)?.type + ")"} onClear={() => setTransferFilter({ ...transferFilter, fromAccountId: undefined })}>
                                    <Select value={transferFilter.fromAccountId} onValueChange={(e) => setTransferFilter({ ...transferFilter, fromAccountId: e })}>
                                        {accounts.map((account) => (
                                            <SelectItem key={account.id} value={account.id}>{account.name} ({account.type})</SelectItem>
                                        ))}
                                    </Select>
                                </TableFilter>
                                <TableFilter title="To Account" property={transferFilter.toAccountId} display={accounts.find(x => x.id == transferFilter.toAccountId)?.name + " (" + accounts.find(x => x.id == transferFilter.toAccountId)?.type + ")"} onClear={() => setTransferFilter({ ...transferFilter, toAccountId: undefined })}>
                                    <Select value={transferFilter.toAccountId} onValueChange={(e) => setTransferFilter({ ...transferFilter, toAccountId: e })}>
                                        {accounts.map((account) => (
                                            <SelectItem key={account.id} value={account.id}>{account.name} ({account.type})</SelectItem>
                                        ))}
                                    </Select>
                                </TableFilter>
                                <TableFilter title="Category" property={transferFilter.categoryId} display={categories.find(x => x.id == transferFilter.categoryId)?.title} onClear={() => setTransferFilter({ ...transferFilter, categoryId: undefined })}>
                                    <Select value={transferFilter.categoryId} onValueChange={(e) => setTransferFilter({ ...transferFilter, categoryId: e })}>
                                        {categories.map((category) => (
                                            <SelectItem key={category.id} value={category.id}>{category.title}</SelectItem>
                                        ))}
                                    </Select>
                                </TableFilter>
                                <TableFilter title="Status" property={transferFilter.status} display={transferFilter.status} onClear={() => setTransferFilter({ ...transferFilter, status: undefined })}>
                                    <Select value={transferFilter.status} onValueChange={(e) => setTransferFilter({ ...transferFilter, status: e })}>
                                        <SelectItem value="CLEARED">Cleared</SelectItem>
                                        <SelectItem value="PENDING">Pending</SelectItem>
                                        <SelectItem value="CANCELLED">Cancelled</SelectItem>
                                    </Select>
                                </TableFilter>
                                <TableFilter title="Cost"
                                    property={(transferFilter.condition && (transferFilter.condition != 'is between'
                                        ? (transferFilter.minCost || transferFilter.maxCost)
                                        : (transferFilter.minCost && transferFilter.maxCost)))}
                                    display={
                                        transferFilter.condition != "is between" ? (
                                            transferFilter.condition + " $" + (transferFilter.minCost ?? 0)
                                        ) : (
                                            transferFilter.condition + " $" + (transferFilter.minCost ?? 0) + " and $" + (transferFilter.maxCost ?? 0)
                                        )
                                    }
                                    onClear={() => setTransferFilter({ ...transferFilter, minCost: undefined, maxCost: undefined })}>
                                    <div className="flex flex-col gap-1">
                                        <div>
                                            <label htmlFor="distance" className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">Select condition</label>
                                            <Select className="mx-auto max-w-md bg-white" id="condition" name="condition" value={transferFilter.condition} onValueChange={(e) => {
                                                setTransferFilter({ ...transferFilter, condition: e });
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
                                                transferFilter.condition == "is between" ? (
                                                    <div className="flex items-center gap-2">
                                                        <NumberInput placeholder="$0" className="max-w-12" enableStepper={false} value={transferFilter.minCost} onValueChange={(e) => setTransferFilter({ ...transferFilter, minCost: e, })} />
                                                        <span className="text-gray-500">and</span>
                                                        <NumberInput placeholder="$0" className="max-w-12" enableStepper={false} value={transferFilter.maxCost} onValueChange={(e) => setTransferFilter({ ...transferFilter, maxCost: e })} />
                                                    </div>
                                                ) : (
                                                    <NumberInput placeholder="$0" className="max-w-12" enableStepper={false} value={transferFilter.minCost} onValueChange={(e) => setTransferFilter({ ...transferFilter, minCost: e, maxCost: e, })} />
                                                )
                                            }
                                        </div>
                                    </div>
                                </TableFilter>
                                <li className="relative z-10">
                                    <input type="search" className="block w-full appearance-none rounded-md border px-2.5 py-1 outline-none transition sm:text-sm border-transparent text-gray-900 placeholder-gray-400 bg-gray-100 focus:ring-0 focus:ring-indigo-300 focus:border-indigo-300 [&::--webkit-search-cancel-button]:hidden [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden pl-8" placeholder="Search by description" value={description} onChange={(e) => setDescription(e.target.value)} />
                                    <div className="pointer-events-none absolute bottom-0 left-2 flex h-full items-center justify-center text-gray-400">
                                        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" aria-hidden="true" className="size-[1.125rem] shrink-0">
                                            <path d="M18.031 16.6168L22.3137 20.8995L20.8995 22.3137L16.6168 18.031C15.0769 19.263 13.124 20 11 20C6.032 20 2 15.968 2 11C2 6.032 6.032 2 11 2C15.968 2 20 6.032 20 11C20 13.124 19.263 15.0769 18.031 16.6168ZM16.0247 15.8748C17.2475 14.6146 18 12.8956 18 11C18 7.1325 14.8675 4 11 4C7.1325 4 4 7.1325 4 11C4 14.8675 7.1325 18 11 18C12.8956 18 14.6146 17.2475 15.8748 16.0247L16.0247 15.8748Z"></path>
                                        </svg>
                                    </div>
                                </li>
                                <li className="hidden xl:flex ml-auto">
                                    <CreateTransferModal button={
                                        <button disabled={categories.length <= 0} className="rounded-md border border-gray-300 px-2 py-1.5 hover:bg-gray-50 outline outline-offset-2 outline-0 focus-visible:outline-2 outline-indigo-500 flex gap-1 items-center disabled:opacity-50">
                                            <span aria-hidden="true">
                                                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" aria-hidden="true" className="size-5 -ml-px shrink-0 transition sm:size-4">
                                                    <path d="M11 11V5H13V11H19V13H13V19H11V13H5V11H11Z"></path>
                                                </svg>
                                            </span>
                                            Add
                                        </button>
                                    } accounts={accounts} categories={categories} />
                                </li>
                            </TableFilters>
                        </Table>
                    }
                </div>
            </section>
        </main>
    );
}
