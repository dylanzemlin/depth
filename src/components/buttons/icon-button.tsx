type ButtonProps = {
    color?: string;
    size?: 'xs' | 'sm' | 'md' | 'lg';
    onClick?: () => void;
    padding?: string;
    children?: React.ReactNode;
    className?: string;
}

export default function IconButton(props: ButtonProps) {
    const color = props.color ?? 'gray';
    const size = props.size ? `px-${props.padding ?? '2'} py-${props.padding ?? '2'} text-${props.size}` : `px-${props.padding ?? '2'} py-${props.padding ?? '2'}`;
    return (
        <button className={`${size} text-black border border-${color}-500 rounded-lg hover:bg-${color}-200 transition-colors focus:outline-none focus:ring focus:ring-${color}-400 ${props.className}`} onClick={props.onClick}>
            {props.children}
        </button>
    )
}