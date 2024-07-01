"use client"
;
import { createContext, useContext, useEffect, useState } from "react";

interface User {
    id: string;
    name: string;
    email: string;
    avatarUrl: string;
}

type authContextType = {
    user: User | null;
    loading: boolean;
    isAuthenticated: boolean;
    loginWithEmailAndPassword: (email: string, password: string) => Promise<string | undefined>;
    loginWithGoogle: () => Promise<string | undefined>;
    loginWithGithub: () => Promise<string | undefined>;
    signupWithEmailAndPassword: (email: string, name: string, password: string) => Promise<string | undefined>;
    logout: () => Promise<string | undefined>;
};

const AuthContext = createContext<authContextType>({
    user: null,
    loading: true,
    isAuthenticated: false,
    loginWithEmailAndPassword: async () => undefined,
    loginWithGoogle: async () => undefined,
    loginWithGithub: async () => undefined,
    signupWithEmailAndPassword: async () => undefined,
    logout: async () => undefined,
});

export const useAuth = () => {
    return useContext(AuthContext);
};

async function logout(): Promise<string | undefined>
{
    const response = await fetch("/api/v1/logout", {
        method: "POST",
    });

    if (response.status === 200)
    {
        return undefined;
    }

    return response.statusText;
}

async function loginWithEmailAndPassword(email: string, password: string)
{
    const response = await fetch("/api/v1/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (response.status === 201)
    {
        const data = await response.json();
        return data.id;
    }

    return response.statusText;
}

async function loginWithGoogle()
{
    const params = new URLSearchParams({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        redirect_uri: process.env.NEXT_PUBLIC_GOOGLE_REDIRECT,
        scope: "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email",
        response_type: "code",
        prompt: "consent"
    })

    const uri = `https://accounts.google.com/o/oauth2/auth?${params.toString()}`;
    window.location.href = uri;

    return undefined;
}

async function loginWithGithub()
{
    const params = new URLSearchParams({
        client_id: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID,
        redirect_uri: process.env.NEXT_PUBLIC_GITHUB_REDIRECT,
        scope: "read:user user:email",
    });

    const uri = `https://github.com/login/oauth/authorize?${params.toString()}`;
    window.location.href = uri;

    return undefined;
}

async function signupWithEmailAndPassword(email: string, name: string, password: string)
{
    const response = await fetch("/api/v1/signup", {
        method: "POST",
        body: JSON.stringify({ email, name, password }),
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (response.status === 201)
    {
        const data = await response.json();
        return data.id;
    }

    return response.statusText;
}

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const isAuthenticated = !!user;

    useEffect(() => {
        async function fetchUser()
        {
            const response = await fetch("/api/v1/user/me");
            if (response.status === 200)
            {
                const data = await response.json();
                setUser(data.user);
            }

            setLoading(false);
        }

        fetchUser();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                isAuthenticated,
                loginWithEmailAndPassword: loginWithEmailAndPassword,
                loginWithGoogle: loginWithGoogle,
                loginWithGithub: loginWithGithub,
                signupWithEmailAndPassword: signupWithEmailAndPassword,
                logout: logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider;