// app/user/layout.tsx
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Header from "./_components/Header";
import Footer from "./_components/Footer";

export default async function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) {
    redirect("/login");
  }


  return <>
  <Header/>
  {children}
  <Footer/>
  </>;
}
