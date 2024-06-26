import { FaFolder, FaHome, FaMoneyBill } from "react-icons/fa";
import { FaArrowsLeftRight, FaVectorSquare } from "react-icons/fa6";

export default function Navbar() {
    return (
        <nav className="border-gray-200 border flex flex-col items-center min-w-56 p-2 px-4">
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
                    <button type="button" className="py-2 w-full hover:bg-violet-100 flex items-center px-4 gap-4 rounded-md" aria-controls="accounts_dropdown" data-collapse-toggle="accounts_dropdown">
                        <FaFolder className="inline-block w-6 h-6" />
                        <span className="flex-1 text-left rtl:text-right whitespace-nowrap">Accounts</span>
                        <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                        </svg>
                    </button>
                    <ul id="accounts_dropdown" className="-my-2">
                        <li>
                            <a href="/accounts/abc123" className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-violet-100">USAA</a>
                        </li>
                        <li>
                            <a href="/accounts/abc123" className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-violet-100">Discover Savings</a>
                        </li>
                        <li>
                            <a href="/accounts/abc123" className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-violet-100">Discover Credit</a>
                        </li>
                    </ul>
                    <li className="w-full">
                        <a href="/transactions" className="py-2 w-full hover:bg-violet-100 flex items-center px-4 gap-4 rounded-md">
                            <FaArrowsLeftRight className="inline-block w-6 h-6" />
                            Transactions
                        </a>
                    </li>
                </ul>
            </div>

            <div className="h-[1px] w-full bg-gray-200 my-3"></div>

            {/* Seperations */}
            <div className="w-full">
                <ul className="w-full flex flex-col gap-4">
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
                </ul>
            </div>

            {/* Footer */}
            <div className="mt-auto pb-2">
                <button id="dropdownAvatarNameButton" data-dropdown-toggle="dropdownAvatarName" className="flex items-center text-sm pe-1 font-medium text-gray-900 rounded-full md:me-0 focus:ring-4 focus:ring-gray-100" type="button">
                    <span className="sr-only">Open user menu</span>
                    <img className="w-8 h-8 me-2 rounded-full" src="https://ui-avatars.com/api/?rounded=true&name=Dylan%20Zemlin&size=51" alt="user photo" />
                    Dylan Zemlin
                    <svg className="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                    </svg>
                </button>

                <div id="dropdownAvatarName" className="z-10 hidden rounded-lg shadow w-44">
                    <div className="px-4 py-3 text-sm text-gray-900">
                        <div className="font-medium ">Dylan Zemlin</div>
                        <div className="truncate">dylansmrw@gmail.com</div>
                    </div>
                    <ul className="py-2 text-sm text-gray-700" aria-labelledby="dropdownInformdropdownAvatarNameButtonationButton">
                        <li>
                            <a href="/home" className="block px-4 py-2 hover:bg-gray-100">Home</a>
                        </li>
                        <li>
                            <a href="/settings" className="block px-4 py-2 hover:bg-gray-100">Settings</a>
                        </li>
                    </ul>
                    <div className="py-2">
                        <a href="/signout" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Sign out</a>
                    </div>
                </div>
            </div>
        </nav>
    )
}