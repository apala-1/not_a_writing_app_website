'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-orange-50 px-4 sm:px-6 lg:px-8">
      <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-md relative">
        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1 bg-orange-100 text-orange-600 rounded-md hover:bg-orange-200 hover:text-orange-700 transition"
        >
          <span className="text-lg">←</span>
          <span className="text-sm font-medium">Back</span>
        </button>

        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Login</h2>

        <form className="space-y-6">
          <input
            type="email"
            placeholder="Email"
            className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-800 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-800 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 cursor-pointer text-gray-500 hover:text-orange-500 select-none"
            >
              {showPassword ? '🙈' : '👁️'}
            </span>
          </div>

          <button className="w-full bg-orange-500 text-white py-3 rounded-md text-lg hover:bg-orange-600 transition-colors">
            Login
          </button>

          {/* Forgot password */}
          <p className="text-center mt-4 text-sm text-gray-700">
            <a href="/forgot-password" className="text-orange-600 hover:underline">
              Forgot password?
            </a>
          </p>

          {/* Social login */}
          <div className="flex items-center justify-center gap-6 mt-6">
            <button className="flex items-center gap-2 border px-4 py-2 rounded hover:bg-gray-50 text-gray-700">
              <Image src="/images/googleLogo.png" alt="Google" width={20} height={20} />
              <span className="text-sm font-medium">Google</span>
            </button>
            <button className="flex items-center gap-2 border px-4 py-2 rounded hover:bg-gray-50 text-gray-700">
              <Image src="/images/facebookLogo.png" alt="Facebook" width={20} height={20} />
              <span className="text-sm font-medium">Facebook</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
