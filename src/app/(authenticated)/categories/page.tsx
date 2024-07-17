"use client";

import FlowbiteReinit from "@/molecules/FlowbiteReinit";
import Button from "@/molecules/buttons/button";
import ConfirmModal from "@/molecules/modals/confirm-modal";
import Modal from "@/molecules/modals/modal";
import useCategories from "@/lib/hooks/useCategories";
import useSwitch from "@/lib/hooks/useSwitch";
import { Category } from "@prisma/client";
import { DateRangePicker, Select, SelectItem, TextInput } from "@tremor/react";
import { Dropdown } from "flowbite";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaAnglesLeft, FaAnglesRight, FaAngleLeft, FaAngleRight, FaWandMagic, FaRegFolder } from "react-icons/fa6";
import TableFilter from "@/molecules/tables/filter";

type CategoryList = {
    data: Category[],
    pagination: {
        nextUrl: string | null,
        prevUrl: string | null,
        total: number,
        current: number,
        pageSize: number
    }
}

export default function Categories() {
    const [filterArchived, setArchived] = useState<string | undefined>("Not Archived");
    const [newTitle, setTitle] = useState<string>("");
    const [newDescription, setDescription] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [page, setPage] = useState<number>(0);
    const [selectedCategory, setSelectedCategory] = useState<Category | undefined>(undefined);

    const createModalSwitch = useSwitch(false);
    const editModalSwitch = useSwitch(false);
    const archiveModalSwitch = useSwitch(false);

    const categories = useCategories({
        page,
        filter: { archived: filterArchived === "Archived" }
    })

    const createCategory = async () => {
        if (newTitle.length <= 0 || newDescription.length <= 0) {
            toast.error("Please fill in all fields.");
            return;
        }

        setLoading(true);
        const response = await fetch("/api/v1/category", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title: newTitle,
                description: newDescription
            })
        })
        setLoading(false);

        if (response.status !== 201) {
            toast.error("Failed to create category.");
            return;
        }

        toast.success(`Category "${newTitle}" created.`);
        setTitle("");
        setDescription("");
    }

    const updateCategory = async (toggle?: boolean) => {
        if (selectedCategory == undefined) {
            toast.error("Please select a category.");
            return;
        }

        setLoading(true);
        const response = await fetch(`/api/v1/category/${selectedCategory.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title: newTitle,
                description: newDescription,
                archived: toggle ? !selectedCategory.archived : selectedCategory.archived
            })
        })
        setLoading(false);

        if (response.status !== 201) {
            toast.error("Failed to update category.");
            return;
        }

        toast.success(`Category "${selectedCategory.title}" ${toggle ? (selectedCategory.archived ? "unarchived" : "archived") : "updated"}.`);
        setSelectedCategory(undefined);

        archiveModalSwitch.setFalse();
        editModalSwitch.setFalse();
    }

    useEffect(() => {
        if (selectedCategory == null) {
            return;
        }

        setTitle(selectedCategory.title);
        setDescription(selectedCategory.description);

        const dropdown = new Dropdown(
            document.getElementById("category_dropdown"),
            document.getElementById(`btn_${selectedCategory.id}`)
        );
        dropdown.show();
    }, [selectedCategory])

    useEffect(() => {
        if (selectedCategory == null) {
            return;
        }

        const dropdown = new Dropdown(
            document.getElementById("category_dropdown"),
            document.getElementById(`btn_${selectedCategory.id}`)
        );
        dropdown.hide();
    }, [editModalSwitch.state, archiveModalSwitch.state])

    if (categories.loading || categories.pagination == null || categories.categories == null) {
        return <h1>loading...</h1>;
    }

    const pageSize = categories.pagination.pageSize;
    return (
        <FlowbiteReinit>
            <main className="w-full min-h-screen p-2 md:p-12">
                <section aria-labelledby="current-budget">
                    <h1 className="scroll-mt-10 text-3xl">
                        Categories
                    </h1>

                    <div className="space-y-2">
                        {/* Header */}
                        <div className="md:text-xs mt-4">
                            <ul className="flex flex-col xl:flex-row gap-2 bg-white xl:bg-none" id="dropdown_filters">
                                <li>
                                    <TableFilter title="Archived" property={filterArchived} display={filterArchived} onClear={() => setArchived(undefined)}>
                                        <Select className="mx-auto max-w-md bg-white" id="condition" name="condition" value={filterArchived} onValueChange={(e) => {
                                            setArchived(e);
                                        }}>
                                            <SelectItem value="Archived">
                                                Archived
                                            </SelectItem>
                                            <SelectItem value="Not Archived">
                                                Not Archived
                                            </SelectItem>
                                        </Select>
                                    </TableFilter>
                                </li>
                                <li className="ml-auto hidden xl:flex">
                                    <button className="rounded-md border border-gray-300 px-2 py-1.5 hover:bg-gray-50 outline outline-offset-2 outline-0 focus-visible:outline-2 outline-indigo-500 flex gap-1 items-center" onClick={createModalSwitch.setTrue}>
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
                                            Title
                                        </th>
                                        <th className="border-b px-4 text-left font-semibold text-gray-900 border-gray-200 whitespace-nowrap py-1 text-sm">
                                            Description
                                        </th>
                                        {
                                            !filterArchived && (
                                                <th className="border-b px-4 text-left font-semibold text-gray-900 border-gray-200 whitespace-nowrap py-1 text-sm">
                                                    Archived
                                                </th>
                                            )
                                        }
                                        <th className="border-b px-4 text-left font-semibold text-gray-900 border-gray-200 whitespace-nowrap py-1 text-sm max-w-5">
                                            Edit
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        categories.categories.map((category: any) => {
                                            return (
                                                <tr className="border-b border-gray-200" key={category.id}>
                                                    <td className="px-4 py-2 text-xs md:text-sm">
                                                        {category.title}
                                                    </td>
                                                    <td className="px-4 py-2 text-xs md:text-sm">
                                                        {category.description}
                                                    </td>
                                                    {
                                                        !filterArchived && (
                                                            <td className="px-4 py-2 text-xs md:text-sm">
                                                                {category.archived ? (
                                                                    <span className="whitespace-nowrap rounded text-xs ring-1 bg-emerald-50 text-emerald-800 px-1.5 py-0.5 ring-emerald-600/30">
                                                                        Archived
                                                                    </span>
                                                                ) : (
                                                                    <span className="whitespace-nowrap rounded text-xs ring-1 bg-yellow-50 text-yellow-800 ring-yellow-600/30 px-1.5 py-0.5">
                                                                        Not Archived
                                                                    </span>
                                                                )}                                                            </td>
                                                        )
                                                    }
                                                    <td className="px-4 py-2 text-xs md:text-sm max-w-5">
                                                        <button id={`btn_${category.id}`} className="rounded-md whitespace-nowrap text-center transition-all duration-200 ease-in-out focus-visible:outline-2 outline-indigo-500 border-gray-300 p-1.5 border hover:bg-gray-100 border-opacity-0 hover:border-opacity-100" onClick={() => {
                                                            setSelectedCategory(category);
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
                        <div className={`w-full flex-row justify-between sm:justify-end items-center gap-8 ${categories.categories ? 'flex' : 'hidden'}`}>
                            <p className="flex text-sm tabular-nums text-gray-500 gap-1">
                                Showing
                                <span className="font-medium text-gray-900">
                                    {(categories.pagination.current || 0) * pageSize + 1}-{Math.min((categories.pagination.current || 0) * pageSize + pageSize, categories?.pagination.total || 0)}
                                </span>
                                of
                                <span className="font-medium text-gray-900">
                                    {categories.pagination.total || 0}
                                </span>
                            </p>
                            <div className="flex items-center gap-x-1.5">
                                <button
                                    onClick={() => setPage(0)}
                                    className="rounded-md whitespace-nowrap text-center transition-all duration-200 ease-in-out focus-visible:outline-2 outline-indigo-500 border-gray-300 p-1.5 border hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-transparent" disabled={categories.pagination.prevUrl == null}>
                                    <FaAnglesLeft />
                                </button>
                                <button
                                    onClick={() => setPage(page - 1)}
                                    className="rounded-md whitespace-nowrap text-center transition-all duration-200 ease-in-out focus-visible:outline-2 outline-indigo-500 border-gray-300 p-1.5 border hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-transparent" disabled={categories.pagination.prevUrl == null}>
                                    <FaAngleLeft />
                                </button>
                                <button
                                    onClick={() => setPage(page + 1)}
                                    className="rounded-md whitespace-nowrap text-center transition-all duration-200 ease-in-out focus-visible:outline-2 outline-indigo-500 border-gray-300 p-1.5 border hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-transparent" disabled={categories.pagination.nextUrl == null}>
                                    <FaAngleRight />
                                </button>
                                <button
                                    onClick={() => setPage(Math.floor((categories.pagination?.total || 0) / Math.max(pageSize, 1)))}
                                    className="rounded-md whitespace-nowrap text-center transition-all duration-200 ease-in-out focus-visible:outline-2 outline-indigo-500 border-gray-300 p-1.5 border hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-transparent" disabled={categories.pagination.nextUrl == null}>
                                    <FaAnglesRight />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Dropdowns */}
                    <div id={`category_dropdown`} className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700">
                        <ul className="p-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
                            <li>
                                <button className="px-4 py-2 hover:bg-gray-100 rounded-lg w-full text-left font-semibold flex gap-2 items-center" onClick={editModalSwitch.setTrue} >
                                    <FaWandMagic />
                                    Edit
                                </button>
                            </li>
                            <li>
                                <button className="px-4 py-2 hover:bg-gray-100 text-red-600 rounded-lg w-full text-left font-semibold flex gap-2 items-center" onClick={archiveModalSwitch.setTrue} >
                                    <FaRegFolder />
                                    {
                                        selectedCategory?.archived ? "Unarchive" : "Archive"
                                    }
                                </button>
                            </li>
                        </ul>
                    </div>

                    <Modal isOpen={createModalSwitch.state} onClose={createModalSwitch.setFalse} title="Create Category" footer={
                        <div className="flex justify-start gap-2">
                            <Button color="violet" size="sm" title="Create" onClick={createCategory} loading={loading} disabled={newTitle.length <= 0 || newDescription.length <= 0} />
                            <Button color="slate" size="sm" title="Cancel" onClick={createModalSwitch.setFalse} disabled={loading} />
                        </div>
                    }>
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                                Title
                            </label>
                            <TextInput id="title" title="Title" value={newTitle} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
                        </div>
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                Description
                            </label>
                            <TextInput id="description" title="Description" value={newDescription} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
                        </div>
                    </Modal>

                    <Modal isOpen={editModalSwitch.state} onClose={editModalSwitch.setFalse} title="Edit Category" footer={
                        <div className="flex justify-start gap-2">
                            <Button color="violet" size="sm" title="Save" onClick={() => updateCategory(false)} loading={loading} disabled={newTitle.length <= 0 || newDescription.length <= 0} />
                            <Button color="slate" size="sm" title="Cancel" onClick={editModalSwitch.setFalse} disabled={loading} />
                        </div>
                    }>
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                                Title
                            </label>
                            <TextInput id="title" title="Title" value={newTitle} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
                        </div>
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                Description
                            </label>
                            <TextInput id="description" title="Description" value={newDescription} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
                        </div>
                    </Modal>

                    <ConfirmModal isOpen={archiveModalSwitch.state} onClose={archiveModalSwitch.setFalse} title={selectedCategory?.archived ? "Unarchive" : "Archive"} onConfirm={async () => await updateCategory(true)} confirmText={selectedCategory?.archived ? "Unarchive" : "Archive"}>
                        Are you sure you want to {selectedCategory?.archived ? "unarchive" : "archive"} the category "{selectedCategory?.title}"?
                    </ConfirmModal>
                </section>
            </main>
        </FlowbiteReinit>
    );
}
