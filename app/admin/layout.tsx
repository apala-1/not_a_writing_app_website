import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  // AdminLayout (optional)
const cookieStore = await cookies();
const token = cookieStore.get("accessToken")?.value;
if (!token) redirect("/login");

// AdminUsersLayout
const res = await fetch("http://localhost:3000/api/v1/auth/me", {
  headers: { cookie: `accessToken=${token}` },
  cache: "no-store",
});
if (!res.ok) redirect("/login");
const user = await res.json();
if (user.data.role !== "admin") redirect("/");

// Now children render
return <>{children}</>;

}
