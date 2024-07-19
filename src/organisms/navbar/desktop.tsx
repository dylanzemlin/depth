"use client";

import { useAuth } from "@/lib/auth";
import Image from "next/image";
import { FaFolder, FaHome, FaLink, FaMoneyBill } from "react-icons/fa";
import { FaCalendar, FaMoneyBillTransfer, FaMoneyCheck, FaNetworkWired, FaShield, FaSimCard, FaVectorSquare } from "react-icons/fa6";
import { Account } from "@prisma/client";
import { accountTypeToDisplayName, accountTypeToIcon } from "./core";
import { Popover, PopoverContent, PopoverTrigger } from "@/molecules/popover";
import { Accordion, AccordionBody, AccordionButton } from "@/molecules/accordion";

type DesktopNavProps = {
    onAccountModalOpen: () => void;
    accounts: Account[];
}

export default function DesktopNav(props: DesktopNavProps) {
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
                    }
                </ul>
            </div>

            {/* Footer */}
            <div className="mt-auto pb-2">
                <Popover>
                    <PopoverTrigger>
                        <button className="flex items-center text-sm pe-1 font-medium text-gray-900 rounded-full md:me-0 focus:ring-4 focus:ring-gray-100" type="button">
                            <span className="sr-only">Open user menu</span>
                            {
                                auth.user && (
                                    <Image width={64} height={64} className="w-8 h-8 me-2 rounded-full" src={auth.user?.avatarUrl || ""} alt="user photo" />
                                )
                            }
                            {auth.user?.name}
                            <svg className="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                            </svg>
                        </button>
                    </PopoverTrigger>
                    <PopoverContent>
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
                    </PopoverContent>
                </Popover>
            </div>
        </div>
    )
}