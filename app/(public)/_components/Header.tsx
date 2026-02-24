// import Link from "next/link";
// import ThemeToggle from "./ThemeToggle";

// export default function Header() {
//   return (
//     <header className="sticky top-0 z-50 bg-white shadow-md">
//       <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
//         {/* Logo / Brand */}
//         <Link
//           href="/"
//           className="text-2xl font-extrabold text-orange-600 tracking-tight hover:text-orange-700 transition-colors"
//         >
//           Not A Writing App
//         </Link>

//         {/* Navigation */}
//         <nav className="flex items-center gap-6">
//           <Link
//             href="/about"
//             className="text-gray-700 hover:text-orange-600 transition-colors"
//           >
//             About
//           </Link>

//           <Link
//             href="/login"
//             className="px-5 py-2 rounded-md border border-orange-500 text-orange-500 font-medium hover:bg-orange-500 hover:text-white transition-colors"
//           >
//             Login
//           </Link>

//           <Link
//             href="/register"
//             className="px-5 py-2 rounded-md bg-orange-500 text-white font-medium hover:bg-orange-600 transition-colors"
//           >
//             Register
//           </Link>

//           {/* Theme Toggle */}
//           <ThemeToggle />
//         </nav>
//       </div>
//     </header>
//   );
// }

'use client';

import React from 'react';
import { Search, PenLine } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { clearToken } from '@/lib/auth/storage';

export default function Header() {
  const router = useRouter();
  return (
    <header className="bg-white border-b-[3px] border-blue-400 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo area */}
        <div className="flex items-center gap-2">
          <div className="bg-yellow-400 p-2 rounded-xl text-white">
            <PenLine size={24} className="text-gray-800" strokeWidth={2.5} />
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-2xl mx-8 relative">
          <input
            type="text"
            placeholder="Search posts, writers, tags.."
            className="w-full pl-4 pr-10 py-2 border border-gray-400 rounded-full focus:outline-none focus:border-gray-500 bg-transparent text-sm"
          />
          <Search size={18} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-6">
          <button className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium px-6 py-2 rounded-full text-sm transition-colors flex items-center gap-1">
            <span>+</span> Write
          </button>
          <button
                onClick={() => {
                  clearToken();
                  router.push("/login");
                }}
              >
                Logout
              </button>
          <div className="w-10 h-10 rounded-full bg-gray-200 cursor-pointer"></div>
        </div>
      </div>
    </header>
  );
}