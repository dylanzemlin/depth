import { Popover, PopoverContent, PopoverTrigger } from "../popover";

type TableFilterProps = {
    title: string;
    property?: any;
    display?: string;
    onClear: () => void;
    children: React.ReactNode;
}

export default function TableFilter(props: TableFilterProps) {
    return (
        <Popover>
            <PopoverTrigger>
                <li>
                    <button className="rounded-md border border-gray-300 px-2 py-1.5 hover:bg-gray-50 outline outline-offset-2 outline-0 focus-visible:outline-2 outline-indigo-500 flex gap-1 items-center min-w-full xl:min-w-fit">
                        <span aria-hidden="true">
                            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" aria-hidden="true" className="size-5 -ml-px shrink-0 transition-all duration-300 sm:size-4" style={{
                                rotate: props.property ? "45deg" : "0deg"
                            }} onClick={props.onClear}>
                                <path d="M11 11V5H13V11H19V13H13V19H11V13H5V11H11Z"></path>
                            </svg>
                        </span>
                        {props.title}
                        {
                            props.property ? (
                                <>
                                    <div className="w-[1px] h-4 bg-gray-300"></div>
                                    <span className="text-indigo-600 font-medium">
                                        {props.display}
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
            </PopoverTrigger>

            <PopoverContent>
                {props.children}
            </PopoverContent>
        </Popover>
    )
}