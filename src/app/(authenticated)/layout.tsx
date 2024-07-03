"use client";

import Loading from "@/components/loading";
import Navbar from "@/components/navbar/core";
import { useAuth } from "@/lib/auth";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
  const auth = useAuth();

  return (
    <>
      {
        auth.loading && (
          <div className="w-full min-h-screen flex items-center justify-center absolute bg-white z-50">
            <div className="flex items-center justify-center h-full w-full">
              <h1 className="scroll-mt-10 text-3xl w-8 h-8">
                <Loading />
              </h1>
            </div>
          </div>
        )
      }

      <Navbar />
      {children}
    </>
  );
}
