type TransactionEntry = {
    id: string;
    date: string;
    description: string;
    amount: number;
    status: string;
    account: string;
}

export default function Home() {
    return (
        <main className="w-full min-h-screen p-12">
            <section aria-labelledby="current-budget">
                <h1 className="scroll-mt-10 text-3xl font-semiboldsm:text-xl">
                    Transactions
                </h1>
                
                <div className="space-y-3">
                    {/* Header */}
                    <div className="flex w-full flex-col gap-2">

                    </div>

                    {/* Table */}
                    <div>
                        <table className="w-full caption-bottom border-b border-gray-200">
                            <thead>
                                <tr className="[&_td:last-child]:pr-4 [&_th:last-child]:pr-4 [&_td:first-child]:pl-4 [&_th:first-child]:pl-4 border-y border-gray-200">
                                    <th className="border-b px-4 text-left font-semibold text-gray-900 dark:text-gray-50 border-gray-200 dark:border-gray-800 whitespace-nowrap py-1 text-sm sm:text-xs">
                                        Date
                                    </th>
                                    <th className="border-b px-4 text-left font-semibold text-gray-900 dark:text-gray-50 border-gray-200 dark:border-gray-800 whitespace-nowrap py-1 text-sm sm:text-xs">
                                        Account
                                    </th>
                                    <th className="border-b px-4 text-left font-semibold text-gray-900 dark:text-gray-50 border-gray-200 dark:border-gray-800 whitespace-nowrap py-1 text-sm sm:text-xs">
                                        Status
                                    </th>
                                    <th className="border-b px-4 text-left font-semibold text-gray-900 dark:text-gray-50 border-gray-200 dark:border-gray-800 whitespace-nowrap py-1 text-sm sm:text-xs">
                                        Description
                                    </th>
                                    <th className="border-b px-4 text-left font-semibold text-gray-900 dark:text-gray-50 border-gray-200 dark:border-gray-800 whitespace-nowrap py-1 text-sm sm:text-xs">
                                        Amount
                                    </th>
                                    <th className="border-b px-4 text-left font-semibold text-gray-900 dark:text-gray-50 border-gray-200 dark:border-gray-800 whitespace-nowrap py-1 text-sm sm:text-xs">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b border-gray-200">
                                    <td className="px-4 py-2 text-sm sm:text-xs">
                                        2021-12-01
                                    </td>
                                    <td className="px-4 py-2 text-sm sm:text-xs text-blue-500">
                                        <a href="/accounts/1">USAA</a>
                                    </td>
                                    <td className="px-4 py-2 text-sm sm:text-xs">
                                        Pending
                                    </td>
                                    <td className="px-4 py-2 text-sm sm:text-xs">
                                        Payment for groceries
                                    </td>
                                    <td className="px-4 py-2 text-sm sm:text-xs">
                                        $50.00
                                    </td>
                                    <td className="px-4 py-2 text-sm sm:text-xs">
                                        <button className="text-blue-500">Edit</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Footer */}
                    <div>

                    </div>
                </div>
            </section>
        </main>
    );
}
