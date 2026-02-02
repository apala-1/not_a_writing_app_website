import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  const role = cookieStore.get("role")?.value;

  if (!token) {
    redirect("/login");
  }

  if (role !== "admin") {
    redirect("/dashboard");
  }

  return <>{children}</>;
}
