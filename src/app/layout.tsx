import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/lib/auth";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Depth",
    description: "A basic finance tool",
};

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
        }
    }
});

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en light" style={{ colorScheme: "light" }}>
            <body className={`${inter.className} flex flex-col xl:flex-row overflow-y-auto scroll-auto antialiased`}>
                <QueryClientProvider client={queryClient}>
                    <AuthProvider>
                        {children}

                        <script src="/3rd/flowbite.min.js" />
                        <Toaster position="top-center" />
                    </AuthProvider>
                </QueryClientProvider>
            </body>
        </html>
    );
}
