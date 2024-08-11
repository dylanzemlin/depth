export default function Test() {
    // Get all environment variables that start with "VERCEL_"
    const vercelEnv = Object.keys(process.env)
        .filter((key) => key.startsWith("VERCEL_"))
        .reduce((env: any, key: any) => {
            env[key] = process.env[key];
            return env;
        }, {});

    if (process.env.VERCEL != "1") {
        return (
            <main className="flex flex-wrap min-h-screen w-full gap-4 p-4 bg-slate-100 flex-col">
                <div className="bg-slate-200 p-4 rounded-lg">
                    This page is only available on Vercel.
                </div>
            </main>
        );
    }

    return (
        <main className="flex flex-wrap min-h-screen w-full gap-4 p-4 bg-slate-100 flex-col">
            {
                Object.entries(vercelEnv).map(([key, value]) => (
                    <div key={key} className="bg-slate-200 p-4 rounded-lg">
                        <h2 className="text-lg font-bold">{key}</h2>
                        <p>{value as any}</p>
                    </div>
                ))
            }
        </main>
    );
}
