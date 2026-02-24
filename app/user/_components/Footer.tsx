import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-gray-50 py-6 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6 flex flex-col gap-4">
        {/* Links row */}
        <div className="flex justify-between items-center text-xs font-semibold text-gray-600">
          <a href="#" className="hover:underline">Terms and Conditions</a>
          <a href="#" className="hover:underline">Privacy Policy</a>
        </div>
        
        {/* Copyright row */}
        <div className="text-center text-[10px] text-gray-500 font-medium">
          © 2025 Not a Writing App. All rights reserved.
        </div>
      </div>
    </footer>
  );
}