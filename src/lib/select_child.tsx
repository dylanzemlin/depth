import { Children } from "react";

export function selectChild(children: React.ReactNode, className: string): React.ReactNode | undefined
{
    if (children == undefined)
    {
        return undefined;
    }

    const childArray = Children.toArray(children);
    const selectedChild = childArray.find(child => (child as any)?.type?.name == className);
    return selectedChild;
}

export function selectChildren(children: React.ReactNode, className: string): React.ReactNode[]
{
    if (children == undefined)
    {
        return [];
    }

    const childArray = Children.toArray(children);
    const selectedChildren = childArray.filter(child => (child as any)?.type?.name == className);
    return selectedChildren;
}