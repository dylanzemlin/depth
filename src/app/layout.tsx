import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";

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
    <html lang="en">
      <body className={`${inter.className} flex flex-row`}>
        {children}
        <Script src="https://unpkg.com/flowbite@1.5.1/dist/flowbite.js" />
      </body>
    </html>
  );
}
