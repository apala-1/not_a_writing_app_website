import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo / Brand */}
        <Link
          href="/"
          className="text-2xl font-extrabold text-orange-600 tracking-tight hover:text-orange-700 transition-colors"
        >
          Not A Writing App
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-6">
          <Link
            href="/about"
            className="text-gray-700 hover:text-orange-600 transition-colors"
          >
            About
          </Link>

          <Link
            href="/login"
            className="px-5 py-2 rounded-md border border-orange-500 text-orange-500 font-medium hover:bg-orange-500 hover:text-white transition-colors"
          >
            Login
          </Link>

          <Link
            href="/register"
            className="px-5 py-2 rounded-md bg-orange-500 text-white font-medium hover:bg-orange-600 transition-colors"
          >
            Register
          </Link>

          {/* Theme Toggle */}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
