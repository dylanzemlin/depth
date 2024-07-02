import { useState } from "react";

type UseSwitchReturn = {
    state: boolean;
    toggle: () => void;
    setTrue: () => void;
    setFalse: () => void;
}

export default function useSwitch(initialState: boolean): UseSwitchReturn {
    const [state, setState] = useState<boolean>(initialState);

    const toggle = () => setState(!state);
    const setTrue = () => setState(true);
    const setFalse = () => setState(false);

    return {
        state,
        toggle,
        setTrue,
        setFalse
    }
}