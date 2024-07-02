import Loading from "../loading";

type ButtonProps = {
    color?: string;
    outline?: boolean;
    size?: 'sm' | 'md' | 'lg';
    title?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    disabled?: boolean;
    loading?: boolean;
    onClick?: () => void;
    className?: string;
}

export default function Button(props: ButtonProps) {
    const color = props.color ?? 'blue';
    const outline = props.outline ? 'border' : 'bg';
    const size = props.size ? `px-2 py-1 text-${props.size}` : 'px-2 py-1';
    const border = props.outline ? `text-black hover:bg-gray-200` : 'text-white';

    return (
        <button disabled={props.disabled || props.loading} className={`${size} ${border} ${outline}-${color}-500 border-2 border-${color}-500 rounded hover:${outline}-${color}-600 focus:outline-none focus:ring focus:ring-${color}-400 flex items-center ${props.className} disabled:opacity-50`}
         onClick={props.onClick}>
            {
                props.loading ? (
                    <div className="w-4 h-4 mr-1">
                        <Loading />
                    </div>
                ) : (
                    props.leftIcon
                )
            }
            {props.title}
            {props.rightIcon}
        </button>
    )
}