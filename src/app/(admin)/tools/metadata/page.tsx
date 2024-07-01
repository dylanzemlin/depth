"use client";

import { useAuth } from "@/lib/auth";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";

function MetaGroup({ children, title }: { children: React.ReactNode, title: string }) {
    return (
        <div className="flex flex-col gap-2 w-full">
            <h4 className="text-lg font-bold text-slate-900">
                {title}
            </h4>
            {children}
        </div>
    );
}

function Meta({ children, title }: { children: React.ReactNode, title: string }) {
    return (
        <div className="flex items-center gap-2 w-max text-nowrap">
            <h3 className="text-lg font-medium text-slate-900">
                {title}
            </h3>
            <div className="w-full h-[1px] border border-gray-400 min-w-4" />
            {children}
        </div>
    );
}

export default function Login() {
    const auth = useAuth();
    const searchParams = useSearchParams();
    const pathName = usePathname();
    const searchParamsEntries = Array.from(searchParams.entries());

    return (
        <main className="flex min-h-screen w-full gap-4 p-4 bg-slate-100 flex-col">
            <MetaGroup title="Authentication">
                <Meta title="Loading"> { auth.loading ? 'True' : 'False' } </Meta>
                { auth.user == null ? (
                    <Meta title="User">None</Meta>
                ) : (
                    <>
                        <Meta title="ID">{auth.user.id}</Meta>
                        <Meta title="Name">{auth.user.name}</Meta>
                        <Meta title="Email">{auth.user.email}</Meta>
                        <Meta title="Avatar">
                            <Image alt="User avatar" src={auth.user.avatarUrl} width={64} height={64} />
                        </Meta>
                    </>
                ) }
            </MetaGroup>
            <MetaGroup title="Search Params">
                { searchParamsEntries.length === 0 ? (
                    <Meta title="None">None</Meta>
                ) : (
                    searchParamsEntries.map(([key, value]) => (
                        <Meta key={key} title={key}>{value}</Meta>
                    ))
                ) }
            </MetaGroup>
            <MetaGroup title="Route">
                <Meta title="Pathname">{pathName}</Meta>
            </MetaGroup>
        </main>
    );
}
