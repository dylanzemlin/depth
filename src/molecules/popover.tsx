import { Transition } from "@headlessui/react";
import { Placement } from "@popperjs/core";
import { Children, cloneElement, isValidElement, useEffect, useRef, useState } from "react";
import { usePopper } from "react-popper";

type PopoverProps = {
    children: React.ReactNode;
    placement?: Placement;
}

export function Popover(props: PopoverProps) {
    const [triggerRef, setTriggerRef] = useState<any>();
    const [contentRef, setContentRef] = useState<any>();
    const outerRef = useRef<HTMLDivElement>(null);
    const [open, setOpen] = useState(false);
    const { styles, attributes } = usePopper(triggerRef, contentRef, {
        placement: props.placement || "bottom",
        strategy: "absolute",
        modifiers: [
            {
                name: "offset",
                options: {
                    offset: [0, 10]
                }
            }
        ]
    });

    const handleTriggerClick = () => {
        setOpen(!open);
    }

    const trigger = Children.toArray(props.children).find(child => {
        if (isValidElement(child) && (child.type as any).name == PopoverTrigger.name) {
            return child;
        }
    });

    const content = Children.toArray(props.children).find(child => {
        if (isValidElement(child) && (child.type as any).name == PopoverContent.name) {
            return child;
        }
    });

    const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
            setOpen(false);
        }
    }

    const handleClick = (e: MouseEvent) => {
        if (outerRef.current?.contains(e.target as Node)) {
            return;
        }

        setOpen(false);
    }

    useEffect(() => {
        document.addEventListener("keydown", handleEscape);
        return () => {
            document.removeEventListener("keydown", handleEscape);
        }
    }, []);

    useEffect(() => {
        document.addEventListener("click", handleClick);
        return () => {
            document.removeEventListener("click", handleClick);
        }
    }, []);

    return (
        <div ref={outerRef}>
            <div onClick={handleTriggerClick} ref={setTriggerRef}>
                {trigger}
            </div>
            <Transition
                show={open}
                enter="transition-opacity duration-75"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
            >
                <div ref={setContentRef} style={styles.popper} {...attributes.popper}>
                    {content}
                </div>
            </Transition>
        </div>
    );
}

type PopoverTriggerProps = {
    children: React.ReactNode;
}

export function PopoverTrigger(props: PopoverTriggerProps) {
    return props.children;
}

type PopoverContentProps = {
    children: React.ReactNode;
}

export function PopoverContent(props: PopoverContentProps) {
    return (
        <div className="z-50 bg-white rounded-md shadow p-2">
            {props.children}
        </div>
    );
}