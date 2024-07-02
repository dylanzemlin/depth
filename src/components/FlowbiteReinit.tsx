import { initFlowbite } from "flowbite";

export default function FlowbiteReinit({ children }: { children?: React.ReactNode }) {
    if (typeof window !== "undefined") {
        initFlowbite();
    }

    return <>{children}</>;
}