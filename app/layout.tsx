import "./globals.css";
import type { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-orange-50 text-gray-800">
        {children}
      </body>
    </html>
  );
}
