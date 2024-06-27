"use client";

import { TextInput } from "@tremor/react";
import { FaGithub, FaGoogle } from "react-icons/fa6";
import { useState } from "react";

export default function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    return (
        <main className="flex items-center justify-center min-h-screen w-full gap-4 p-12 bg-slate-100 flex-col">
            <div className="bg-white rounded-lg shadow-lg border-gray-200 border-2 p-12 w-fit h-fit flex flex-col items-center justify-center">
                <h1 className="font-bold text-3xl mb-8">
                    Welcome
                </h1>

                {/* Login Form */}
                <div className="flex flex-col gap-2">
                    <TextInput placeholder="First Name" value={email} onValueChange={setEmail} />
                    <TextInput placeholder="Last Name" value={email} onValueChange={setEmail} />
                    <TextInput placeholder="Email" value={email} onValueChange={setEmail} />
                    <TextInput placeholder="Password" type="password" value={password} onValueChange={setPassword} />
                    <button className="text-white p-2 rounded-lg shadow-md bg-violet-500 border w-full hover:bg-violet-600/90 transition-colors mt-4">
                        Register
                    </button>
                </div>

                {/* Or */}
                <div className="flex items-center gap-2 mt-4 w-full">
                    <div className="bg-gray-400 w-full h-[1px]" />
                    <span className="text-gray-500">Or</span>
                    <div className="bg-gray-400 w-full h-[1px]" />
                </div>

                {/* Google */}
                <div className="w-full flex flex-col mt-4 gap-2">
                    <a href="/login/google" className="flex items-center gap-2 bg-white p-2 rounded-lg shadow-md border-gray-2300 border w-full justify-center hover:bg-gray-100 transition-colors">
                        <FaGoogle size={24} color="#4285F4" />
                        <span>Google</span>
                    </a>
                    <a href="/login/github" className="flex items-center gap-2 bg-white p-2 rounded-lg shadow-md border-gray-2300 border w-full justify-center hover:bg-gray-100 transition-colors">
                        <FaGithub size={24} color="#333" />
                        <span>Github</span>
                    </a>
                </div>
            </div>
            <div>
                <div className="text-center mt-4 flex gap-2">
                    <span className="text-black">Already have an account?</span>
                    <a href="/login" className="text-violet-500 cursor-pointer font-semibold">Login now</a>
                </div>
            </div>
        </main>
    );
}
