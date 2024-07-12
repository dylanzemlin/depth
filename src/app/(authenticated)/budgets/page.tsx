"use client";

import Button from "@/components/buttons/button";
import Modal from "@/components/modals/modal";
import useBudgets from "@/lib/hooks/useBudgets";
import useCategories from "@/lib/hooks/useCategories";
import useSwitch from "@/lib/hooks/useSwitch";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { DatePicker, NumberInput, Select, SelectItem, TextInput } from "@tremor/react";
import { useState } from "react";
import toast from "react-hot-toast";
import { FaAnglesLeft, FaAnglesRight, FaArrowsLeftRight, FaEquals, FaGreaterThan, FaLessThan, FaAngleLeft, FaAngleRight } from "react-icons/fa6";

type FilterDate = {
    from?: Date;
    to?: Date;
}

export default function Budgets() {
    const [filterCondition, setFilterCondition] = useState<string | undefined>(undefined);
    const [filterGoalRange, setFilterGoalRange] = useState<(number | undefined)[]>([undefined, undefined]);
    const [filterCategory, setFilterCategory] = useState<string | undefined>(undefined);
    const [filterDescription, setFilterDescription] = useState<string | undefined>(undefined);
    const [page, setPage] = useState<number>(0);
    const createSwitch = useSwitch(false);

    const [newBudgetDescription, setNewBudgetDescription] = useState<string | undefined>(undefined);
    const [newBudgetGoal, setNewBudgetGoal] = useState<number | undefined>(undefined);
    const [newBudgetCategory, setNewBudgetCategory] = useState<string | undefined>(undefined);
    const [newBudgetStartDate, setNewBudgetStartDate] = useState<Date>(new Date());
    const [newBudgetEndDate, setNewBudgetEndDate] = useState<Date | undefined>(undefined);

    const budgets = useBudgets({
        page, filter: {
            categoryId: filterCategory,
            condition: filterCondition as any,
            goal_1: filterGoalRange[0],
            goal_2: filterGoalRange[1],
            description: filterDescription
        }
    });
    const categories = useCategories({ pageSize: 100 });

    const createBudget = async () => {
        if (newBudgetDescription == null || newBudgetGoal == null || newBudgetCategory == null) {
            return;
        }

        const created = await budgets.createBudget({
            description: newBudgetDescription,
            goal: newBudgetGoal,
            categoryId: newBudgetCategory,
            startDate: newBudgetStartDate,
            endDate: newBudgetEndDate
        });

        if (created) {
            toast.success("Budget created successfully");
        } else {
            toast.error("Failed to create budget");
        }

        createSwitch.setFalse();
    }

    if (budgets.loading || categories.loading || budgets.budgets == null || categories.categories == null) {
        return <h1>Loading...</h1>;
    }

    const pageSize = budgets?.pagination?.pageSize ?? 0;
    return (
        <main className="w-full min-h-screen p-2 md:p-12">
            <section aria-labelledby="current-budget">
                <h1 className="scroll-mt-10 text-3xl">
                    Budgets
                </h1>

                <div className="space-y-2">
                    {/* Header */}
                    <div className="md:text-xs mt-4">
                        <ul className="flex flex-col xl:flex-row gap-2 bg-white xl:bg-none" id="dropdown_filters">
                            <li>
                                <Menu>
                                    <MenuButton className="rounded-md border border-gray-300 px-2 py-1.5 hover:bg-gray-50 outline outline-offset-2 outline-0 focus-visible:outline-2 outline-violet-500 flex gap-1 items-center min-w-full xl:min-w-fit">
                                        <span aria-hidden="true">
                                            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" aria-hidden="true" className="size-5 -ml-px shrink-0 transition-all duration-300 sm:size-4" style={{
                                                rotate: filterCategory ? "45deg" : "0deg"
                                            }} onClick={(e) => {
                                                if (filterCategory) {
                                                    setFilterCategory(undefined)
                                                    e.preventDefault();
                                                }
                                            }}>
                                                <path d="M11 11V5H13V11H19V13H13V19H11V13H5V11H11Z"></path>
                                            </svg>
                                        </span>
                                        Category
                                        {
                                            filterCategory ? (
                                                <>
                                                    <div className="w-[1px] h-4 bg-gray-300"></div>
                                                    <span className="text-violet-600 font-medium">
                                                        {categories.categories?.find((category) => category.id == filterCategory)?.title ?? "N/A"}
                                                    </span>
                                                </>
                                            ) : (
                                                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" aria-hidden="true" className="size-5 shrink-0 text-gray-500 sm:size-4">
                                                    <path d="M11.9999 13.1714L16.9497 8.22168L18.3639 9.63589L11.9999 15.9999L5.63599 9.63589L7.0502 8.22168L11.9999 13.1714Z"></path>
                                                </svg>
                                            )
                                        }
                                    </MenuButton>

                                    <MenuItems anchor="bottom" transition className="absolute p-2 right-0 z-10 mt-2 w-fit origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in">
                                        {
                                            categories.categories?.map((category) => {
                                                return (
                                                    <MenuItem key={category.id}>
                                                        <button onClick={() => setFilterCategory(category.id)} className="w-full text-left px-2 py-1.5 hover:bg-gray-50 outline outline-offset-2 outline-0 focus-visible:outline-2 outline-violet-500 flex gap-1 items-center">
                                                            {category.title}
                                                        </button>
                                                    </MenuItem>
                                                );
                                            })
                                        }
                                    </MenuItems>
                                </Menu>
                            </li>
                            <li>
                                <button data-dropdown-toggle="costDropdown" className="rounded-md border border-gray-300 px-2 py-1.5 hover:bg-gray-50 outline outline-offset-2 outline-0 focus-visible:outline-2 outline-violet-500 flex gap-1 items-center min-w-full xl:min-w-fit">
                                    <span aria-hidden="true">
                                        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" aria-hidden="true" className="size-5 -ml-px shrink-0 transition sm:size-4">
                                            <path d="M11 11V5H13V11H19V13H13V19H11V13H5V11H11Z"></path>
                                        </svg>
                                    </span>
                                    Goal
                                    {
                                        filterCondition ? (
                                            <>
                                                <div className="w-[1px] h-4 bg-gray-300"></div>
                                                {
                                                    filterCondition != "is between" ? (
                                                        <span className="text-violet-600 font-medium">
                                                            {filterCondition} ${filterGoalRange[0] ?? 0}
                                                        </span>
                                                    ) : (
                                                        <span className="text-violet-600 font-medium">
                                                            {filterCondition} ${filterGoalRange[0] ?? 0} and ${filterGoalRange[1] ?? 0}
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
                            <li className="relative">
                                <input type="search" className="block w-full appearance-none rounded-md border px-2.5 py-1 outline-none transition sm:text-sm border-transparent text-gray-900 placeholder-gray-400 bg-gray-100 focus:ring-2 focus:ring-violet-200 focus:border-violet-500 [&::--webkit-search-cancel-button]:hidden [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden pl-8" placeholder="Search by description" />
                                <div className="pointer-events-none absolute bottom-0 left-2 flex h-full items-center justify-center text-gray-400">
                                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" aria-hidden="true" className="size-[1.125rem] shrink-0">
                                        <path d="M18.031 16.6168L22.3137 20.8995L20.8995 22.3137L16.6168 18.031C15.0769 19.263 13.124 20 11 20C6.032 20 2 15.968 2 11C2 6.032 6.032 2 11 2C15.968 2 20 6.032 20 11C20 13.124 19.263 15.0769 18.031 16.6168ZM16.0247 15.8748C17.2475 14.6146 18 12.8956 18 11C18 7.1325 14.8675 4 11 4C7.1325 4 4 7.1325 4 11C4 14.8675 7.1325 18 11 18C12.8956 18 14.6146 17.2475 15.8748 16.0247L16.0247 15.8748Z"></path>
                                    </svg>
                                </div>
                            </li>
                            <li className="ml-auto hidden xl:flex">
                                <button className="rounded-md border border-gray-300 px-2 py-1.5 hover:bg-gray-50 outline outline-offset-2 outline-0 focus-visible:outline-2 outline-violet-500 flex gap-1 items-center" onClick={createSwitch.setTrue}>
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
                                        Description
                                    </th>
                                    <th className="border-b px-4 text-left font-semibold text-gray-900 border-gray-200 whitespace-nowrap py-1 text-sm">
                                        Category
                                    </th>
                                    <th className="border-b px-4 text-left font-semibold text-gray-900 border-gray-200 whitespace-nowrap py-1 text-sm">
                                        Goal
                                    </th>
                                    <th className="border-b px-4 text-left font-semibold text-gray-900 border-gray-200 whitespace-nowrap py-1 text-sm">
                                        Start Date
                                    </th>
                                    <th className="border-b px-4 text-left font-semibold text-gray-900 border-gray-200 whitespace-nowrap py-1 text-sm">
                                        End Date
                                    </th>
                                    <th className="border-b px-4 text-left font-semibold text-gray-900 border-gray-200 whitespace-nowrap py-1 text-sm max-w-5">
                                        Edit
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    budgets.budgets?.map((budget) => {
                                        return (
                                            <tr className="border-b border-gray-200" key={budget.id}>
                                                <td className="px-4 py-2 text-xs md:text-sm">
                                                    {budget.description}
                                                </td>
                                                <td className="px-4 py-2 text-xs md:text-sm">
                                                    {budget.category.title}
                                                </td>
                                                <td className="px-4 py-2 text-xs md:text-sm">
                                                    ${budget.amount}
                                                </td>
                                                <td className="px-4 py-2 text-xs md:text-sm">
                                                    {budget.startDate.toString()}
                                                </td>
                                                <td className="px-4 py-2 text-xs md:text-sm">
                                                    {budget.endDate?.toString() ?? "N/A"}
                                                </td>
                                                <td className="px-4 py-2 text-xs md:text-sm max-w-5">
                                                    <button className="rounded-md whitespace-nowrap text-center transition-all duration-200 ease-in-out focus-visible:outline-2 outline-violet-500 border-gray-300 p-1.5 border hover:bg-gray-100 border-opacity-0 hover:border-opacity-100" data-dropdown-toggle={`row_dropdown_${budget.id}`}>
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
                    <div className="w-full flex flex-row justify-between sm:justify-end items-center gap-8">
                        <p className="flex text-sm tabular-nums text-gray-500 gap-1">
                            Showing
                            <span className="font-medium text-gray-900">
                                {
                                    ((budgets?.pagination?.total || 0) > 0 ? (budgets?.pagination?.current || 0) * pageSize + 1 : 0)
                                }-{Math.min((budgets?.pagination?.current || 0) * pageSize + pageSize, budgets?.pagination?.total || 0)}
                            </span>
                            of
                            <span className="font-medium text-gray-900">
                                {budgets?.pagination?.total || 0}
                            </span>
                        </p>
                        <div className="flex items-center gap-x-1.5">
                            <button className="rounded-md whitespace-nowrap text-center transition-all duration-200 ease-in-out focus-visible:outline-2 outline-violet-500 border-gray-300 p-1.5 border hover:bg-gray-100">
                                <FaAnglesLeft />
                            </button>
                            <button className="rounded-md whitespace-nowrap text-center transition-all duration-200 ease-in-out focus-visible:outline-2 outline-violet-500 border-gray-300 p-1.5 border hover:bg-gray-100">
                                <FaAngleLeft />
                            </button>
                            <button className="rounded-md whitespace-nowrap text-center transition-all duration-200 ease-in-out focus-visible:outline-2 outline-violet-500 border-gray-300 p-1.5 border hover:bg-gray-100">
                                <FaAngleRight />
                            </button>
                            <button className="rounded-md whitespace-nowrap text-center transition-all duration-200 ease-in-out focus-visible:outline-2 outline-violet-500 border-gray-300 p-1.5 border hover:bg-gray-100">
                                <FaAnglesRight />
                            </button>
                        </div>
                    </div>
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
                                        <NumberInput placeholder="$0" className="max-w-12" enableStepper={false} onValueChange={(e) => setFilterGoalRange([e, filterGoalRange[1]])} />
                                        <span className="text-gray-500">and</span>
                                        <NumberInput placeholder="$0" className="max-w-12" enableStepper={false} onValueChange={(e) => setFilterGoalRange([filterGoalRange[0], e])} />
                                    </div>
                                ) : (
                                    <NumberInput placeholder="$0" className="max-w-12" enableStepper={false} onValueChange={(e) => setFilterGoalRange([e, e])} />
                                )
                            }
                        </div>
                    </div>
                </div>
            </section>

            <Modal isOpen={createSwitch.state} onClose={createSwitch.toggle} title="Create Budget" backdrop footer={
                <div className="flex justify-start gap-2">
                    <Button color="violet" size="sm" title="Create" onClick={createBudget} disabled={newBudgetDescription == null || newBudgetGoal == null || newBudgetCategory == null} />
                    <Button color="slate" size="sm" title="Cancel" onClick={createSwitch.setFalse} />
                </div>
            }>
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        Description
                    </label>
                    <TextInput id="description" name="description" placeholder="Description" value={newBudgetDescription} onValueChange={(e) => setNewBudgetDescription(e)} />
                </div>
                <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                        Amount
                    </label>
                    <NumberInput id="amount" name="amount" value={newBudgetGoal} onValueChange={(e) => setNewBudgetGoal(e)} enableStepper={false} min={0} placeholder="Amount" />
                </div>
                <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                        Category
                    </label>
                    <Select id="category" name="category" value={newBudgetCategory} onValueChange={(e) => setNewBudgetCategory(e)}>
                        {
                            categories.categories?.map((category) => {
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
                    <label htmlFor="start_date" className="block text-sm font-medium text-gray-700">
                        Start Date
                    </label>
                    <DatePicker id="start_date" value={newBudgetStartDate} onValueChange={(e) => setNewBudgetStartDate(new Date(e?.toUTCString() ?? new Date().toUTCString()))}  />
                </div>
                <div>
                    <label htmlFor="end_date" className="block text-sm font-medium text-gray-700">
                        End Date
                    </label>
                    <DatePicker id="end_date" value={newBudgetEndDate} onValueChange={(e) => setNewBudgetEndDate(new Date(e?.toUTCString() ?? new Date().toUTCString()))} />
                </div>
            </Modal>
        </main>
    );
}
