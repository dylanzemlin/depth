import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import AuthProvider from "@/lib/auth";
import { Toaster } from "react-hot-toast";

const robot = Roboto({
    weight: ["400", "500", "700"],
    subsets: ["latin"]
});
import "./globals.css";

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
            <body className={`${robot.className} flex flex-col xl:flex-row overflow-y-auto scroll-auto antialiased`}>
                <AuthProvider>
                    {children}

                    <script src="/3rd/flowbite.min.js" />
                    <Toaster position="top-center" />
                </AuthProvider>
            </body>
        </html>
    );
}
