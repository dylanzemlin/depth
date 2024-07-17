import Loading from "../loading";

export type FullLoadingProps = {
    injectMain?: boolean;
}

export default function FullLoading(props: FullLoadingProps) {
    return (
        props.injectMain ? (
            <main className="w-full min-h-screen p-2 md:p-12">
                <section className="flex items-center justify-center h-full w-full">
                    <h1 className="scroll-mt-10 text-3xl w-8 h-8">
                        <Loading />
                    </h1>
                </section>
            </main>
        ) : (
            <section className="flex items-center justify-center h-full w-full">
                <h1 className="scroll-mt-10 text-3xl w-8 h-8">
                    <Loading />
                </h1>
            </section>
        )
    )
}