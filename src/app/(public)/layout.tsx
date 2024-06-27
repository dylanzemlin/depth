import Navbar from "@/components/navbar/core";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
