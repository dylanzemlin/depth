"use client";

import { Select, SelectItem, TextInput } from "@tremor/react";
import { useState } from "react";
import { FaAnglesLeft, FaAnglesRight, FaAngleLeft, FaAngleRight, FaWandMagic, FaRegFolder } from "react-icons/fa6";

export default function Categories() {
    const [filterArchived, setArchived] = useState<string | undefined>("Not Archived");
    const [newTitle, setTitle] = useState<string>("");
    const [newDescription, setDescription] = useState<string>("");

    return (
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
                                <button data-dropdown-toggle="archiveDropdown" className="rounded-md border border-gray-300 px-2 py-1.5 hover:bg-gray-50 outline outline-offset-2 outline-0 focus-visible:outline-2 outline-violet-500 flex gap-1 items-center min-w-full xl:min-w-fit">
                                    <span aria-hidden="true">
                                        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" aria-hidden="true" className="size-5 -ml-px shrink-0 transition sm:size-4">
                                            <path d="M11 11V5H13V11H19V13H13V19H11V13H5V11H11Z"></path>
                                        </svg>
                                    </span>
                                    Archived
                                    {
                                        filterArchived ? (
                                            <>
                                                <div className="w-[1px] h-4 bg-gray-300"></div>
                                                <span className="text-violet-600 font-medium">
                                                    {filterArchived}
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
                            <li className="ml-auto hidden xl:flex">
                                <button data-modal-target="create_category_modal" data-modal-toggle="create_category_modal" className="rounded-md border border-gray-300 px-2 py-1.5 hover:bg-gray-50 outline outline-offset-2 outline-0 focus-visible:outline-2 outline-violet-500 flex gap-1 items-center">
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
                                    <th className="border-b px-4 text-left font-semibold text-gray-900 border-gray-200 whitespace-nowrap py-1 text-sm max-w-5">
                                        Edit
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    Array.from({ length: 20 }).map((_, index) => (
                                        <tr className="border-b border-gray-200" key={index}>
                                            <td className="px-4 py-2 text-xs md:text-sm">
                                                Entertainment
                                            </td>
                                            <td className="px-4 py-2 text-xs md:text-sm">
                                                Spotify
                                            </td>
                                            <td className="px-4 py-2 text-xs md:text-sm max-w-5">
                                                <button className="rounded-md whitespace-nowrap text-center transition-all duration-200 ease-in-out focus-visible:outline-2 outline-violet-500 border-gray-300 p-1.5 border hover:bg-gray-100 border-opacity-0 hover:border-opacity-100" data-dropdown-toggle={`row_dropdown_${index}`}>
                                                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" aria-hidden="true" className="remixicon size-4 shrink-0 text-gray-500 group-hover:text-gray-700 group-data-[state=open]:text-gray-700">
                                                        <path d="M5 10C3.9 10 3 10.9 3 12C3 13.1 3.9 14 5 14C6.1 14 7 13.1 7 12C7 10.9 6.1 10 5 10ZM19 10C17.9 10 17 10.9 17 12C17 13.1 17.9 14 19 14C20.1 14 21 13.1 21 12C21 10.9 20.1 10 19 10ZM12 10C10.9 10 10 10.9 10 12C10 13.1 10.9 14 12 14C13.1 14 14 13.1 14 12C14 10.9 13.1 10 12 10Z"></path>
                                                    </svg>
                                                </button>
                                                <div id={`row_dropdown_${index}`} className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700">
                                                    <ul className="p-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
                                                        <li>
                                                            <button className="px-4 py-2 hover:bg-gray-100 rounded-lg w-full text-left font-semibold flex gap-2 items-center">
                                                                <FaWandMagic />
                                                                Edit
                                                            </button>
                                                        </li>
                                                        <li>
                                                            <button className="px-4 py-2 hover:bg-gray-100 text-red-600 rounded-lg w-full text-left font-semibold flex gap-2 items-center">
                                                                <FaRegFolder />
                                                                Archive
                                                            </button>
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

                    {/* Footer */}
                    <div className="w-full flex flex-row justify-between sm:justify-end items-center gap-8">
                        <p className="flex text-sm tabular-nums text-gray-500 gap-1">
                            Showing
                            <span className="font-medium text-gray-900">
                                1-20
                            </span>
                            of
                            <span className="font-medium text-gray-900">
                                52
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

                {/* Dropdowns */}
                <div id="archiveDropdown" className="z-10 bg-white rounded-md shadow-lg p-2 border border-gray-300 hidden items-center">
                    <div className="flex flex-col gap-1">
                        <div>
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
                        </div>
                    </div>
                </div>

                {/* Modals */}
                <div id="create_category_modal" tabIndex={-1} aria-hidden="true" className="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
                    <div className="relative p-4 w-full max-w-2xl max-h-full">
                        <div className="relative bg-white rounded-lg shadow">
                            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
                                <h3 className="text-xl font-semibold text-gray-900">
                                    Create Category
                                </h3>
                                <button type="button" className="transition-all duration-300 text-gray-400 bg-transparent hover:rotate-90 hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center" data-modal-hide="create_category_modal">
                                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                    </svg>
                                    <span className="sr-only">Close modal</span>
                                </button>
                            </div>
                            <div className="p-4 md:p-5 space-y-4">
                                <TextInput placeholder="Title" value={newTitle} onValueChange={setTitle} />
                                <TextInput placeholder="Description" value={newDescription} onValueChange={setDescription} />
                            </div>
                            <div className="flex items-center p-4 gap-2 md:p-5 border-t border-gray-200 rounded-b text-sm">
                                <button 
                                    disabled={newTitle.length <= 0 || newDescription.length <= 0}
                                    type="button" 
                                    className="disabled:opacity-50 transition-all duration-100 rounded-md border border-gray-300 px-2 py-1.5 hover:bg-violet-400 outline outline-offset-2 outline-0 focus-visible:outline-2 outline-violet-500 flex gap-1 items-center bg-violet-300">
                                    Create
                                </button>
                                <button data-modal-hide="create_category_modal" type="button" className="transition-all duration-100 rounded-md border border-gray-300 px-2 py-1.5 hover:bg-gray-50 outline outline-offset-2 outline-0 focus-visible:outline-2 outline-violet-500 flex gap-1 items-center">Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
