"use client";

import { TextInput } from "@tremor/react";
import { FaGithub, FaGoogle } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { usePathname, useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathName = usePathname();
    const auth = useAuth();

    useEffect(() => {
        if (searchParams.has("error")) {
            console.log("Error:", searchParams.get("error"));
        }

        if (Array.from(searchParams.entries()).length > 0) {
            router.replace(pathName);
        }
    }, [searchParams]);

    return (
        <main className="flex items-center justify-center min-h-screen w-full gap-4 p-12 bg-slate-100 flex-col">
            <div className="bg-white rounded-lg shadow-lg border-gray-200 border-2 p-12 w-fit h-fit flex flex-col items-center justify-center">
                <h1 className="font-bold text-3xl mb-8">
                    Welcome
                </h1>

                {/* Login Form */}
                <div className="flex flex-col gap-2">
                    <TextInput placeholder="Email" value={email} onValueChange={setEmail} />
                    <TextInput placeholder="Password" type="password" value={password} onValueChange={setPassword} />
                    <button
                        disabled={auth.loading || email.length <= 3 || password.length <= 0}
                        onClick={() => auth.loginWithEmailAndPassword(email, password)}
                        className="text-white p-2 rounded-lg shadow-md bg-violet-500 border w-full hover:bg-violet-600/90 transition-colors mt-2 disabled:opacity-50">
                        Login
                    </button>
                    <a href="/forgot" className="text-gray-500 text-sm cursor-pointer">Forgot password?</a>
                </div>

                {/* Or */}
                <div className="flex items-center gap-2 mt-4 w-full">
                    <div className="bg-gray-400 w-full h-[1px]" />
                    <span className="text-gray-500">Or</span>
                    <div className="bg-gray-400 w-full h-[1px]" />
                </div>

                {/* Google */}
                <div className="w-full flex flex-col mt-4 gap-2">
                    <button onClick={auth.loginWithGoogle} className="flex items-center gap-2 bg-white p-2 rounded-lg shadow-md border-gray-2300 border w-full justify-center hover:bg-gray-100 transition-colors">
                        <FaGoogle size={24} color="#4285F4" />
                        <span>Google</span>
                    </button>
                    <button onClick={auth.loginWithGithub} className="flex items-center gap-2 bg-white p-2 rounded-lg shadow-md border-gray-2300 border w-full justify-center hover:bg-gray-100 transition-colors">
                        <FaGithub size={24} color="#333" />
                        <span>Github</span>
                    </button>
                </div>
            </div>
            <div>
                <div className="text-center mt-4 flex gap-2">
                    <span className="text-black">Don't have an account?</span>
                    <a href="/register" className="text-violet-500 cursor-pointer font-semibold">Register now</a>
                </div>
            </div>
        </main>
    );
}
