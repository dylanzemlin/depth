'use client';

import { useAuth } from "@/lib/auth";
import { useState } from "react";
import { FaFolder, FaHome, FaMoneyBill } from "react-icons/fa";
import { FaArrowsLeftRight, FaCalendar, FaLink, FaMoneyBillTransfer, FaMoneyCheck, FaNetworkWired, FaShield, FaSimCard, FaVectorSquare } from "react-icons/fa6";
import Image from "next/image";
import { Account } from "@prisma/client";
import { accountTypeToDisplayName, accountTypeToIcon } from "./core";
import { Accordion, AccordionBody, AccordionButton } from "@/molecules/accordion";

type MobileNavProps = {
    onAccountModalOpen: () => void;
    accounts: Account[];
}

export default function MobileNav(props: MobileNavProps) {
    const [isOpened, setIsOpened] = useState(false);
    const auth = useAuth();

    return (
        <div className="flex lg:hidden flex-row w-full">
            {/* Header */}
            <div className="flex w-full">
                <span className="text-3xl font-semibold self-center">
                    Depth
                </span>
                <div className="ml-auto flex gap-3">
                    <button id="dropdownMobileAvatarButton" data-dropdown-toggle="dropdownMobileAvatar" data-dropdown-placement="bottom-end" className="p-1 flex items-center text-sm font-medium text-gray-900 rounded-md outline outline-offset-2 outline-0 focus-visible:outline-2 outline-indigo-500 shadow-none border-transparent hover:bg-gray-100 data-[state=open]:bg-gray-400/10" type="button">
                        <span className="sr-only">Open user menu</span>
                        {
                            auth.user && (
                                <Image width={64} height={64} className="w-8 h-8 me-2 rounded-full" src={auth.user?.avatarUrl || ""} alt="user photo" />
                            )
                        }
                    </button>
                    <button type="button" onClick={() => setIsOpened(!isOpened)}>
                        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" aria-hidden="true" className="size-6 shrink-0 sm:size-5">
                            <path d="M3 4H21V6H3V4ZM3 11H21V13H3V11ZM3 18H21V20H3V18Z"></path>
                        </svg>
                    </button>
                </div>
                <div id="dropdownMobileAvatar" className="z-10 hidden rounded-lg shadow-xl border border-gray-200 w-44 bg-white">
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

            <div className={`fixed inset-0 z-50 overflow-y-auto bg-black/70 ${isOpened ? '' : 'hidden'}`}>
                <div className="bg-white rounded-md fixed inset-y-2 mx-auto w-[95vw] overflow-y-auto border p-4 shadow-lg max-sm:inset-x-2 sm:inset-y-2 sm:right-2 sm:p-6 border-gray-200">
                    <div className="w-full flex justify-between">
                        <span className="text-2xl font-semibold self-center">
                            Depth
                        </span>
                        <button type="button" onClick={() => setIsOpened(!isOpened)}>
                            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" aria-hidden="true" className="size-6">
                                <path d="M11.9997 10.5865L16.9495 5.63672L18.3637 7.05093L13.4139 12.0007L18.3637 16.9504L16.9495 18.3646L11.9997 13.4149L7.04996 18.3646L5.63574 16.9504L10.5855 12.0007L5.63574 7.05093L7.04996 5.63672L11.9997 10.5865Z"></path>
                            </svg>
                        </button>
                    </div>

                    <div className="h-[1px] w-full bg-gray-200 my-3"></div>

                    {/* Main Navigation */}
                    <ul className="w-full flex flex-col gap-4">
                        <li className="w-full">
                            <a href="/home" className="py-2 w-full hover:bg-indigo-100 flex items-center px-4 gap-4 rounded-md">
                                <FaHome className="inline-block w-6 h-6" />
                                Home
                            </a>
                        </li>
                        <li className="w-full">
                            <a href="/transactions" className="py-2 w-full hover:bg-indigo-100 flex items-center px-4 gap-4 rounded-md">
                                <FaMoneyCheck className="inline-block w-6 h-6" />
                                Transactions
                            </a>
                        </li>
                        <li className="w-full">
                            <a href="/transfers" className="py-2 w-full hover:bg-indigo-100 flex items-center px-4 gap-4 rounded-md">
                                <FaMoneyBillTransfer className="inline-block w-6 h-6" />
                                Transfers
                            </a>
                        </li>
                        <li className="w-full">
                            <a href="/subscriptions" className="py-2 w-full hover:bg-indigo-100 flex items-center px-4 gap-4 rounded-md">
                                <FaCalendar className="inline-block w-6 h-6" />
                                Subscriptions
                            </a>
                        </li>
                        <li className="w-full">
                            <a href="/budgets" className="py-2 w-full hover:bg-indigo-100 flex items-center px-4 gap-4 rounded-md">
                                <FaMoneyBill className="inline-block w-6 h-6" />
                                Budgets
                            </a>
                        </li>
                        <li className="w-full">
                            <a href="/categories" className="py-2 w-full hover:bg-indigo-100 flex items-center px-4 gap-4 rounded-md">
                                <FaVectorSquare className="inline-block w-6 h-6" />
                                Categories
                            </a>
                        </li>

                        <Accordion defaultOpen>
                            <AccordionButton>
                                <button type="button" className="py-2 w-full hover:bg-indigo-100 flex items-center px-4 gap-4 rounded-md" aria-controls="accounts_dropdown" data-collapse-toggle="accounts_dropdown">
                                    <FaFolder className="inline-block w-6 h-6" />
                                    <span className="flex-1 text-left rtl:text-right whitespace-nowrap">Accounts</span>
                                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                                    </svg>
                                </button>
                            </AccordionButton>

                            <AccordionBody>
                                <ul>
                                    {
                                        props.accounts.map((account) => {
                                            return (
                                                <li key={account.id}>
                                                    <a href={`/accounts/${account.id}`} className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-indigo-100 gap-2 text-nowrap">
                                                        {accountTypeToIcon(account.type)}
                                                        {account.name} ({accountTypeToDisplayName(account.type)})
                                                    </a>
                                                </li>
                                            )
                                        })
                                    }
                                    <li>
                                        <button className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-indigo-100 gap-2 text-nowrap" onClick={props.onAccountModalOpen}>
                                            <FaLink />
                                            Create Account
                                        </button>
                                    </li>
                                </ul>
                            </AccordionBody>
                        </Accordion>

                        {
                            auth.user?.role === "ADMIN" && (
                                <Accordion>
                                    <AccordionButton>
                                        <button type="button" className="py-2 w-full hover:bg-indigo-100 flex items-center px-4 gap-4 rounded-md" aria-controls="accounts_dropdown" data-collapse-toggle="accounts_dropdown">
                                            <FaShield className="inline-block w-6 h-6" />
                                            <span className="flex-1 text-left rtl:text-right whitespace-nowrap">Admin</span>
                                            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                                            </svg>
                                        </button>
                                    </AccordionButton>
                                    <AccordionBody>
                                        <ul>
                                            <li className="w-full">
                                                <a href="/tools/metadata" className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-indigo-100 gap-2 text-nowrap">
                                                    <FaSimCard className="inline-block w-6 h-6" />
                                                    Metadata
                                                </a>
                                            </li>
                                            <li className="w-full">
                                                <a href="/tools/components" className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-indigo-100 gap-2 text-nowrap">
                                                    <FaNetworkWired className="inline-block w-6 h-6" />
                                                    Components
                                                </a>
                                            </li>
                                        </ul>
                                    </AccordionBody>
                                </Accordion>
                            )
                        }
                    </ul>
                </div>
            </div>
        </div>
    )
}