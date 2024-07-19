import { selectChild } from "@/lib/select_child";
import { Transition } from "@headlessui/react";
import { useRef, useState } from "react";

type AccordionProps = {
    children: React.ReactNode;
    defaultOpen?: boolean;
}

export function Accordion(props: AccordionProps) {
    const button = selectChild(props.children, AccordionButton.name);
    const body = selectChild(props.children, AccordionBody.name);
    const [isOpen, setIsOpen] = useState(props.defaultOpen ?? false);

    if (button == null || body == null) {
        throw new Error("Accordion must have an AccordionButton and an AccordionBody");
    }


    return (
        <div>
            <div onClick={() => setIsOpen(!isOpen)}>
                {button}
            </div>
            {/* Transition that opens the body using height */}
            <Transition
                show={isOpen}
                enter="transition-all duration-300 ease-in-out"
                enterFrom="transform scale-95 opacity-0 max-h-0"
                enterTo="transform scale-100 opacity-100 max-h-96"
                leave="transition-all duration-300 ease-in-out"
                leaveFrom="transform scale-100 opacity-100 max-h-96"
                leaveTo="transform scale-95 opacity-0 max-h-0"
            >
                <div>
                    {body}
                </div>
            </Transition>
        </div>
    );
}

type AccordionButtonProps = {
    children: React.ReactNode;
}

export function AccordionButton(props: AccordionButtonProps) {
    return props.children;
}

type AccordionBodyProps = {
    children: React.ReactNode;
}

export function AccordionBody(props: AccordionBodyProps) {
    return props.children;
}