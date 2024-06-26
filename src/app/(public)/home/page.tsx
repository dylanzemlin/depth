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

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-12">
            <section aria-labelledby="current-budget">
                <h1 className="scroll-mt-10 text-3xl font-semiboldsm:text-xl">
                    Budget
                </h1>
                <ul role="list" className="mt-4 space-5 min-w-48 flex flex-col gap-8 max-h-28 w-full flex-wrap">
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
