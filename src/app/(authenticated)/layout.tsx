"use client";

import Navbar from "@/components/navbar/core";
import { useAuth } from "@/lib/auth";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
  const auth = useAuth();

  return (
    <>
      {
        auth.loading && (
          <div className="w-full min-h-screen flex items-center justify-center absolute bg-white z-50">
            <div className="text-2xl font-semibold text-gray-900">Loading...</div>
          </div>
        )
      }

      <Navbar />
      {children}
    </>
  );
}
