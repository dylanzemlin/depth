import { InvalidateQueryFilters, useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"

type UseEditObjectProps<T> = {
    initialData: T
    mutationFn: (data: T) => Promise<any>
    invalidateQueries?: InvalidateQueryFilters
}

type UseEditObjectReturn<T> = {
    data: T
    setProperty: <K extends keyof T>(key: K, value: T[K]) => void
    clear: () => void
    mutate: (clear?: boolean) => Promise<void>
    isPending: boolean
    isError: boolean
    isChanged: boolean
    error: Error | null
}

export default function useEditObject<T>(props: UseEditObjectProps<T>): UseEditObjectReturn<T>
{
    const [data, setData] = useState<T>(props.initialData);
    const queryClient = useQueryClient();
    const mutation = useMutation({ mutationFn: props.mutationFn });

    function setProperty<K extends keyof T>(key: K, value: T[K])
    {
        setData(prev => ({
            ...prev,
            [key]: value
        }));
    }

    function clear()
    {
        setData(props.initialData);
    }

    async function mutate(doClear?: boolean)
    {
        const result = await mutation.mutateAsync(data);
        if (props.invalidateQueries)
        {
            queryClient.invalidateQueries(props.invalidateQueries);
        }

        if (clear)
        {
            clear();
        }

        return result;
    }

    return {
        data,
        setProperty,
        clear,
        mutate,
        isPending: mutation.isPending,
        isError: mutation.isError,
        isChanged: props.initialData !== data,
        error: mutation.error
    };
}