import Loading from "../loading";

export type FullErrorProps = {
    injectMain?: boolean;
    error?: Error | null;
}

export default function FullError(props: FullErrorProps) {
    return (
        props.injectMain ? (
            <main className="w-full min-h-screen p-2 md:p-12">
                <section className="flex items-center justify-center h-full w-full">
                    <p className="text-red-500 text-center">
                        An error has occured
                    </p>
                    {
                        props.error ? (
                            <p className="text-red-500 text-center">
                                {props.error.message}
                            </p>
                        ) : null
                    
                    }
                </section>
            </main>
        ) : (
            <section className="flex items-center justify-center h-full w-full">
                <p className="text-red-500 text-center">
                    An error has occured
                </p>
                {
                    props.error ? (
                        <p className="text-red-500 text-center">
                            {props.error.message}
                        </p>
                    ) : null
                }
            </section>
        )
    )
}