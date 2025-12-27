import type { ReactNode } from "react";
import Header from "./_components/Header";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <main className="min-h-screen px-6">{children}</main>
    </>
  );
}
