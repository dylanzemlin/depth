import { classNames } from "@/lib/classnames";
import { selectChild, selectChildren } from "@/lib/select_child";

export type TableProps = {
    children: React.ReactNode;
}

export function Table(props: TableProps) {
    const head = selectChild(props.children, TableHead.name);
    const body = selectChild(props.children, TableBody.name);
    const footer = selectChild(props.children, TableFooter.name);
    const filters = selectChild(props.children, TableFilters.name);

    if (head == null || body == null) {
        throw new Error("Table must have a TableHead and TableBody");
    }

    return (
        <div className="overflow-hidden overflow-x-auto">
            {filters}
            <table className="caption-bottom border-b border-gray-200 w-full">
                {head}
                {body}
            </table>
            {footer}
        </div>
    );
}

export function TableHead({ children }: { children: React.ReactNode }) {
    const cells = selectChildren(children, TableHeadCell.name);

    return (
        <tr className="[&_td:last-child]:pr-4 [&_th:last-child]:pr-4 [&_td:first-child]:pl-4 [&_th:first-child]:pl-4 border-y border-gray-200">
            {cells}
        </tr>
    )
}

export function TableHeadCell({ children }: { children: React.ReactNode }) {
    return (
        <th className="border-b px-4 text-left font-semibold text-gray-900 border-gray-200 whitespace-nowrap py-1 text-sm">
            {children}
        </th>
    )
}

export function TableBody({ children }: { children: React.ReactNode }) {
    const cells = selectChildren(children, TableRow.name);

    return (
        <tbody>
            {cells}
        </tbody>
    )
}

export function TableRow({ children }: { children: React.ReactNode }) {
    return (
        <tr className="border-b border-gray-200">
            {children}
        </tr>
    )
}

export function TableBodyCell({ children, isLink }: { children: React.ReactNode, isLink?: boolean }) {
    return (
        <td className={classNames("px-4 py-2 text-xs md:text-sm", isLink ? "text-blue-500 hover:text-blue-600" : "")}>
            {children}
        </td>
    )
}

export function TableFooter({ children }: { children: React.ReactNode }) {
    return (
        <div className="mt-2">
            {children}
        </div>
    )
}

export function TableFilters({ children }: { children: React.ReactNode }) {
    return (
        <div className="mb-2 text-xs">
            <ul className="flex flex-col lg:flex-row gap-2 bg-white lg:bg-none">
                {children}
            </ul>
        </div>
    )
}