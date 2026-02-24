"use client";

import { useRouter } from "next/navigation";
import { clearToken } from "@/lib/auth/storage";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = () => {
    clearToken();
    router.push("/login");
  };

  return (
    <button onClick={handleLogout}>
      Logout
    </button>
  );
}
