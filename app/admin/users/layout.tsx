// app/admin/users/layout.tsx
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function AdminUsersLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
    console.log("AdminUsersLayout params:", params);

  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  console.log("AdminUsersLayout token:", token);
  if (!token) {
    redirect("/login");
  }

  const res = await fetch("http://localhost:3000/api/v1/auth/me", {
    headers: { cookie: `accessToken=${token}` },
    cache: "no-store",
  });
  console.log("AdminUsersLayout fetch response:", res);

  if (!res.ok) {
    redirect("/login");
  }

  const user = await res.json();
  console.log("Admin user:", user.data);

  if (user.data.role !== "admin") {
    redirect("/");
  }

  return <>{children}</>;
}
