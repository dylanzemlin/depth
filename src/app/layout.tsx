import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

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
        {children}
        <script src="/3rd/flowbite.min.js" />
      </body>
    </html>
  );
}
