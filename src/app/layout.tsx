import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/lib/auth";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Depth",
    description: "A basic finance tool",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en light" style={{ colorScheme: "light" }}>
            <body className={`${inter.className} flex flex-col xl:flex-row overflow-y-auto scroll-auto antialiased`}>
                <AuthProvider>
                    {children}

                    <script src="/3rd/flowbite.min.js" />
                    <Toaster position="top-center" />
                </AuthProvider>
            </body>
        </html>
    );
}
