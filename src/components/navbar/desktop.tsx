"use client";

import { useAuth } from "@/lib/auth";
import Image from "next/image";
import { FaFolder, FaHome, FaMoneyBill } from "react-icons/fa";
import { FaArrowsLeftRight, FaCalendar, FaVectorSquare } from "react-icons/fa6";

export default function DesktopNav() {
    const auth = useAuth();

    return (
        <div className="hidden lg:flex flex-col h-full items-center">
            {/* Header */}
            <div className="py-3 flex flex-row gap-4">
                <span className="text-3xl font-semibold self-center">
                    Depth
                </span>
            </div>

            <div className="h-[1px] w-full bg-gray-200 mb-3"></div>

            {/* Main Navigation */}
            <div className="w-full">
                <ul className="w-full flex flex-col gap-4">
                    <li className="w-full">
                        <a href="/home" className="py-2 w-full hover:bg-violet-100 flex items-center px-4 gap-4 rounded-md">
                            <FaHome className="inline-block w-6 h-6" />
                            Home
                        </a>
                    </li>
                    <li className="w-full">
                        <a href="/transactions" className="py-2 w-full hover:bg-violet-100 flex items-center px-4 gap-4 rounded-md">
                            <FaArrowsLeftRight className="inline-block w-6 h-6" />
                            Transactions
                        </a>
                    </li>
                    <li className="w-full">
                        <a href="/subscriptions" className="py-2 w-full hover:bg-violet-100 flex items-center px-4 gap-4 rounded-md">
                            <FaCalendar className="inline-block w-6 h-6" />
                            Subscriptions
                        </a>
                    </li>
                    <li className="w-full">
                        <a href="/budgets" className="py-2 w-full hover:bg-violet-100 flex items-center px-4 gap-4 rounded-md">
                            <FaMoneyBill className="inline-block w-6 h-6" />
                            Budgets
                        </a>
                    </li>
                    <li className="w-full">
                        <a href="/categories" className="py-2 w-full hover:bg-violet-100 flex items-center px-4 gap-4 rounded-md">
                            <FaVectorSquare className="inline-block w-6 h-6" />
                            Categories
                        </a>
                    </li>
                    <button type="button" className="py-2 w-full hover:bg-violet-100 flex items-center px-4 gap-4 rounded-md" aria-controls="accounts_dropdown" data-collapse-toggle="accounts_dropdown">
                        <FaFolder className="inline-block w-6 h-6" />
                        <span className="flex-1 text-left rtl:text-right whitespace-nowrap">Accounts</span>
                        <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                        </svg>
                    </button>
                    <ul id="accounts_dropdown" className="-my-2">
                        <li>
                            <a href="/accounts/abc123" className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-violet-100">USAA Debit</a>
                        </li>
                        <li>
                            <a href="/accounts/abc123" className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-violet-100">Discover Savings</a>
                        </li>
                        <li>
                            <a href="/accounts/abc123" className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-violet-100">Discover Credit</a>
                        </li>
                        <li>
                            <a href="/accounts/abc123" className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-violet-100">Amazon Credit</a>
                        </li>
                    </ul>
                </ul>
            </div>

            {/* Footer */}
            <div className="mt-auto pb-2">
                <button id="dropdownAvatarNameButton" data-dropdown-toggle="dropdownAvatarName" className="flex items-center text-sm pe-1 font-medium text-gray-900 rounded-full md:me-0 focus:ring-4 focus:ring-gray-100" type="button">
                    <span className="sr-only">Open user menu</span>
                    <Image width={64} height={64} className="w-8 h-8 me-2 rounded-full" src={auth.user?.avatarUrl || ""} alt="user photo" />
                    {auth.user?.name}
                    <svg className="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                    </svg>
                </button>

                <div id="dropdownAvatarName" className="z-10 hidden rounded-lg shadow w-44">
                    <div className="px-4 py-3 text-sm text-gray-900">
                        <div className="font-medium ">{auth.user?.name}</div>
                        <div className="truncate">{auth.user?.email}</div>
                    </div>
                    <ul className="py-2 text-sm text-gray-700" aria-labelledby="dropdownInformdropdownAvatarNameButtonationButton">
                        <li>
                            <a href="/home" className="block px-4 py-2 hover:bg-gray-100">Home</a>
                        </li>
                        <li>
                            <a href="/settings" className="block px-4 py-2 hover:bg-gray-100">Settings</a>
                        </li>
                    </ul>
                    <div className="py-2 w-full">
                        <button onClick={() => auth.logout()} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-start">Sign out</button>
                    </div>
                </div>
            </div>
        </div>
    )
}