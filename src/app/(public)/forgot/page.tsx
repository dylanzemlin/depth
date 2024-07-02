"use client";

import { TextInput } from "@tremor/react";
import { FaGithub, FaGoogle } from "react-icons/fa6";
import { useState } from "react";

export default function Forgot() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    return (
        <main className="flex items-center justify-center min-h-screen w-full gap-4 p-12 bg-slate-100 flex-col">
            <div className="bg-white rounded-lg shadow-lg border-gray-200 border-2 p-12 w-fit h-fit flex flex-col items-center justify-center max-w-sm">
                <div className="mb-8 flex items-center flex-col justify-center text-center">
                    <h1 className="font-bold text-3xl">
                        Forgot Password
                    </h1>

                    <span className="text-gray-500 text-sm">
                        Enter your email and current two factor authentication code to reset your password.
                    </span>
                </div>

                {/* Login Form */}
                <div className="flex flex-col gap-2">
                    <TextInput placeholder="Email" value={email} onValueChange={setEmail} />
                    <TextInput placeholder="2FA Code" value={email} onValueChange={setEmail} />
                    <button className="text-white p-2 rounded-lg shadow-md bg-violet-500 border w-full hover:bg-violet-600/90 transition-colors mt-4">
                        Submit
                    </button>
                </div>
            </div>
            <div>
                <div className="text-center mt-4 flex gap-2">
                    <a href="/login" className="text-violet-500 cursor-pointer font-semibold">Back to login</a>
                </div>
            </div>
        </main>
    );
}
