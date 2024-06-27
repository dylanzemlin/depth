import { Card, LineChart } from "@tremor/react";
import { useId } from "react";

type ProgressTestProps = {
    value: number;
    max: number;
    title: string;
}

const ProgressTest = (props: ProgressTestProps) => {
    const tooltipId = useId();
    return (
        <>
            <p className="flex justify-between text-sm gap-8">
                <span className="font-medium">
                    {props.title}
                </span>
                <span className="font-medium">
                    ${props.value.toFixed(2)}
                    <span className="mx-1">
                        /
                    </span>
                    <span className="font-normal text-gray-500">
                        ${props.max.toFixed(2)}
                    </span>
                </span>
            </p>
            <div className="flex w-full items-center mt-2 [&>*]:h-1.5" data-tooltip-target={tooltipId}>
                <div className="relative flex h-2 w-full items-center rounded-full bg-indigo-100" aria-label="progress bar" aria-valuenow={492.15} aria-valuemax={1000.00}>
                    <div className="h-full flex-col rounded-full bg-indigo-600" style={{
                        width: `${Math.min((props.value / props.max) * 100, 100)}%`
                    }}>
                    </div>
                </div>
            </div>
            <div id={tooltipId} role="tooltip" className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip">
                <span className="font-bold">
                    {((props.value / props.max) * 100).toFixed(1)}%
                </span>
                <div className="tooltip-arrow" data-popper-arrow></div>
            </div>
        </>
    )
}

const chartdata = [
    {
        date: 'Jan 22',
        Expenses: 2890,
        Deposits: 2338,
    },
    {
        date: 'Feb 22',
        Expenses: 2756,
        Deposits: 2103,
    },
    {
        date: 'Mar 22',
        Expenses: 3322,
        Deposits: 2194,
    },
    {
        date: 'Apr 22',
        Expenses: 3470,
        Deposits: 2108,
    },
    {
        date: 'May 22',
        Expenses: 3475,
        Deposits: 1812,
    },
    {
        date: 'Jun 22',
        Expenses: 3129,
        Deposits: 1726,
    },
    {
        date: 'Jul 22',
        Expenses: 3490,
        Deposits: 1982,
    },
    {
        date: 'Aug 22',
        Expenses: 2903,
        Deposits: 2012,
    },
    {
        date: 'Sep 22',
        Expenses: 2643,
        Deposits: 2342,
    },
    {
        date: 'Oct 22',
        Expenses: 2837,
        Deposits: 2473,
    },
    {
        date: 'Nov 22',
        Expenses: 2954,
        Deposits: 3848,
    },
    {
        date: 'Dec 22',
        Expenses: 3239,
        Deposits: 3736,
    },
]

export default function Home() {
    return (
        <main className="flex min-h-screen w-full flex-col gap-4 p-4 md:p-12 overflow-hidden overflow-y-auto">
            <section aria-labelledby="current-budget">
                <h1 className="scroll-mt-10 text-3xl mb-2">
                    Overview
                </h1>
                <div className="flex gap-4 flex-wrap">
                    <Card className="max-w-sm">
                        <h4 className="text-tremor-default text-tremor-content">
                            Total Balance
                        </h4>
                        <p className="font-semibold text-2xl">
                            $71,465
                        </p>
                    </Card>
                    <Card className="max-w-sm">
                        <h4 className="text-tremor-default text-tremor-content">
                            Income (Month)
                        </h4>
                        <p className="font-semibold text-2xl">
                            $71,465
                        </p>
                    </Card>
                    <Card className="max-w-sm">
                        <h4 className="text-tremor-default text-tremor-content">
                            Expenses (Month)
                        </h4>
                        <p className="font-semibold text-2xl">
                            $71,465
                        </p>
                    </Card>
                </div>

                <div className="scroll-mt-10 text-xl">
                    <LineChart
                        className="h-72"
                        data={chartdata}
                        index="date"
                        yAxisWidth={65}
                        categories={['Expenses', 'Deposits']}
                        colors={['indigo', 'cyan']}
                    />
                </div>
            </section>

            <section aria-labelledby="current-budget" className="max-w-xl md:max-w-4xl">
                <h1 className="scroll-mt-10 text-3xl">
                    Budget
                </h1>
                <ul role="list" className="mt-4 space-5 min-w-48 flex flex-col gap-8 max-h-full md:max-h-28 w-full flex-wrap">
                    <li>
                        <ProgressTest title="Dates" value={492.15} max={1000.00} />
                    </li>
                    <li>
                        <ProgressTest title="Fast Food" value={192.15} max={500.00} />
                    </li>
                    <li>
                        <ProgressTest title="Rent" value={492.15} max={1000.00} />
                    </li>
                    <li>
                        <ProgressTest title="Gas" value={492.15} max={1000.00} />
                    </li>
                    <li>
                        <ProgressTest title="Groceries" value={492.15} max={1000.00} />
                    </li>
                    <li>
                        <ProgressTest title="Subscriptions" value={492.15} max={1000.00} />
                    </li>
                    <li>
                        <ProgressTest title="Entertainment" value={492.15} max={1000.00} />
                    </li>
                    <li>
                        <ProgressTest title="Other" value={492.15} max={1000.00} />
                    </li>
                </ul>
            </section>
        </main>
    );
}
