"use client";

import FullError from "@/molecules/feedback/FullError";
import FullLoading from "@/molecules/feedback/FullLoading";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { Category } from "@prisma/client";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { Table, TableBody, TableBodyCell, TableFilters, TableFooter, TableHead, TableHeadCell, TableRow } from "@/molecules/table";
import { useDebounce } from 'use-debounce';
import { CategoryFilter, getCategories } from "@/lib/api/categories";
import TableFilter from "@/molecules/tables/filter";
import { Select, SelectItem } from "@tremor/react";
import CreateCategoryModal from "@/organisms/categories/createCategoryModal";
import ArchiveCategoryModal from "@/organisms/categories/archiveCategoryModal";
import { classNames } from "@/lib/classnames";
import EditCategoryMdoal from "@/organisms/categories/editCategoryModal";

export default function Categories() {
    const [page, setPage] = useState(0);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

    const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>({ archived: false });
    const categoryQuery = useInfiniteQuery({
        queryKey: ["categories", { filter: categoryFilter }],
        queryFn: getCategories,
        getNextPageParam: (lastPage) => lastPage.pagination.nextUrl ? lastPage.pagination.current + 1 : undefined,
        getPreviousPageParam: (lastPage) => lastPage.pagination.prevUrl ? lastPage.pagination.current - 1 : undefined,
        initialPageParam: 0
    });

    const [description, setDescription] = useState("");
    const [value] = useDebounce(description, 500);
    useEffect(() => {
        setCategoryFilter({ ...categoryFilter, description: value });
    }, [value]);

    if (categoryQuery.isError) {
        return <FullError injectMain error={categoryQuery.error} />
    }

    const pageData = categoryQuery.data?.pages[page];
    const categories = pageData?.data;
    const tPagination = pageData?.pagination;
    const pageSize = tPagination?.pageSize || 0;
    return (
        <main className="w-full min-h-screen p-2 md:p-12">
            <section aria-labelledby="current-budget">
                <h1 className="scroll-mt-10 text-3xl">
                    Categories
                </h1>

                <div className="space-y-2 mt-4">
                    {
                        <Table>
                            <TableHead>
                                <TableHeadCell>Title</TableHeadCell>
                                <TableHeadCell>Description</TableHeadCell>
                                <TableHeadCell>Status</TableHeadCell>
                                <TableHeadCell>Edit</TableHeadCell>
                            </TableHead>
                            <TableBody>
                                {
                                    !categoryQuery.isPending ? categories?.map((category) => {
                                        return (
                                            <TableRow key={category.id}>
                                                <TableBodyCell>
                                                    {category.title}
                                                </TableBodyCell>
                                                <TableBodyCell>
                                                    {category.description}
                                                </TableBodyCell>
                                                <TableBodyCell>
                                                    {category.archived ? (
                                                        <span className="whitespace-nowrap rounded text-xs ring-1 bg-red-50 text-red-800 px-1.5 py-0.5 ring-red-600/30">
                                                            Archived
                                                        </span>
                                                    ) : (
                                                        <span className="whitespace-nowrap rounded text-xs ring-1 bg-green-50 text-green-800 px-1.5 py-0.5 ring-green-600/30">
                                                            Active
                                                        </span>
                                                    )}
                                                </TableBodyCell>
                                                <TableBodyCell>
                                                    <Menu>
                                                        <div>
                                                            <MenuButton onClick={() => {
                                                                setSelectedCategory(category)
                                                            }} className="rounded-md whitespace-nowrap text-center transition-all duration-200 ease-in-out focus-visible:outline-2 outline-indigo-500 border-gray-300 p-1.5 border hover:bg-gray-100 border-opacity-0 hover:border-opacity-100">
                                                                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" aria-hidden="true" className="remixicon size-4 shrink-0 text-gray-500 group-hover:text-gray-700 group-data-[state=open]:text-gray-700">
                                                                    <path d="M5 10C3.9 10 3 10.9 3 12C3 13.1 3.9 14 5 14C6.1 14 7 13.1 7 12C7 10.9 6.1 10 5 10ZM19 10C17.9 10 17 10.9 17 12C17 13.1 17.9 14 19 14C20.1 14 21 13.1 21 12C21 10.9 20.1 10 19 10ZM12 10C10.9 10 10 10.9 10 12C10 13.1 10.9 14 12 14C13.1 14 14 13.1 14 12C14 10.9 13.1 10 12 10Z"></path>
                                                                </svg>
                                                            </MenuButton>
                                                        </div>

                                                        <MenuItems anchor="bottom" transition className="absolute p-2 right-0 z-10 mt-2 w-32 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in">
                                                        <MenuItem>
                                                                {selectedCategory && (
                                                                    <EditCategoryMdoal button={
                                                                        <button className={classNames('hover:bg-gray-100 hover:text-gray-900 text-gray-700', 'block px-4 py-2 text-sm w-full rounded-md text-left')}>
                                                                            Edit
                                                                        </button>
                                                                    } category={selectedCategory} />
                                                                )}
                                                            </MenuItem>
                                                            <MenuItem>
                                                                {selectedCategory && (
                                                                    <ArchiveCategoryModal button={
                                                                        <button className={classNames('hover:bg-gray-100 text-red-500', 'block px-4 py-2 text-sm w-full rounded-md text-left')}>
                                                                            {selectedCategory.archived ? 'Unarchive' : 'Archive'}
                                                                        </button>
                                                                    } category={selectedCategory} method={selectedCategory.archived ? "unarchive" : "archive"} />
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
                                <div className={`w-full flex-row justify-between sm:justify-end items-center gap-4 ${categoryQuery.isSuccess ? 'flex' : 'hidden'}`}>
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
                                                if (categoryQuery.data?.pages && categoryQuery.data.pages.length <= page + 1) {
                                                    await categoryQuery.fetchNextPage();
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
                                <TableFilter title="Status" property={categoryFilter.archived} display={categoryFilter.archived ? "Archived" : "Active"} onClear={() => setCategoryFilter({ ...categoryFilter, archived: undefined })}>
                                    <Select value={
                                        categoryFilter.archived == null ? undefined : categoryFilter.archived ? "Archived" : "Active"
                                    } onValueChange={(e) => setCategoryFilter({ ...categoryFilter, archived: e == "Archived" })}>
                                        <SelectItem value="Active">Active</SelectItem>
                                        <SelectItem value="Archived">Archived</SelectItem>
                                    </Select>
                                </TableFilter>
                                <li className="relative z-10">
                                    <input type="search" className="block w-full appearance-none rounded-md border px-2.5 py-1 outline-none transition sm:text-sm border-transparent text-gray-900 placeholder-gray-400 bg-gray-100 focus:ring-0 focus:ring-indigo-300 focus:border-indigo-300 [&::--webkit-search-cancel-button]:hidden [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden pl-8" placeholder="Search by description" value={description} onChange={(e) => setDescription(e.target.value)} />
                                    <div className="pointer-events-none absolute bottom-0 left-2 flex h-full items-center justify-center text-gray-400">
                                        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" aria-hidden="true" className="size-[1.125rem] shrink-0">
                                            <path d="M18.031 16.6168L22.3137 20.8995L20.8995 22.3137L16.6168 18.031C15.0769 19.263 13.124 20 11 20C6.032 20 2 15.968 2 11C2 6.032 6.032 2 11 2C15.968 2 20 6.032 20 11C20 13.124 19.263 15.0769 18.031 16.6168ZM16.0247 15.8748C17.2475 14.6146 18 12.8956 18 11C18 7.1325 14.8675 4 11 4C7.1325 4 4 7.1325 4 11C4 14.8675 7.1325 18 11 18C12.8956 18 14.6146 17.2475 15.8748 16.0247L16.0247 15.8748Z"></path>
                                        </svg>
                                    </div>
                                </li>
                                <li className="ml-auto hidden xl:flex">
                                    <CreateCategoryModal button={
                                        <button className="rounded-md border border-gray-300 px-2 py-1.5 hover:bg-gray-50 outline outline-offset-2 outline-0 focus-visible:outline-2 outline-indigo-500 flex gap-1 items-center disabled:opacity-50">
                                            <span aria-hidden="true">
                                                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" aria-hidden="true" className="size-5 -ml-px shrink-0 transition sm:size-4">
                                                    <path d="M11 11V5H13V11H19V13H13V19H11V13H5V11H11Z"></path>
                                                </svg>
                                            </span>
                                            Add
                                        </button>
                                    } />
                                </li>
                            </TableFilters>
                        </Table>
                    }
                </div>
            </section>
        </main>
    );
}
