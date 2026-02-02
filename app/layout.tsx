import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";
import type { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-orange-50 text-gray-800">
        <AuthProvider>
        {children}
        </AuthProvider>
      </body>
    </html>
  );
}
