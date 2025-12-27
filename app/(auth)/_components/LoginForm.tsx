'use client';
import { useState } from "react";
import { loginSchema } from "@/app/(auth)/schema";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const values = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    const result = loginSchema.safeParse(values);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach(issue => {
        fieldErrors[issue.path[0] as string] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    console.log("Login success:", result.data);
  };

  return (
    <div className="bg-white/95 backdrop-blur-sm p-8 sm:p-10 rounded-2xl shadow-xl w-full max-w-md border border-orange-100">
      {/* Header: Back (left), Title (center), spacer (right) */}
      <div className="grid grid-cols-3 items-center mb-6">
        <button
          onClick={() => router.back()}
          className="justify-self-start flex items-center gap-2 px-3 py-1.5 rounded-md text-orange-700 bg-orange-50 hover:bg-orange-100 hover:text-orange-800 transition focus:outline-none focus:ring-2 focus:ring-orange-300"
        >
          <span className="text-base">←</span>
          <span className="text-sm font-medium">Back</span>
        </button>

        <h2 className="justify-self-center text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
          Login
        </h2>

        <div className="justify-self-end w-16 h-6" aria-hidden />
      </div>

      {/* Subtle divider */}
      <div className="h-px bg-orange-100 mb-6" />

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition"
          />
          {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-10 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-orange-600 transition"
              aria-label={showPassword ? "Hide password" : "Show password"}
              title={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>
          {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}
        </div>

        <button
          className="w-full bg-orange-500 text-white font-semibold py-3 rounded-lg hover:bg-orange-600 transition focus:outline-none focus:ring-2 focus:ring-orange-300"
        >
          Login
        </button>

        <p className="text-center text-sm">
          <a href="/forgot-password" className="text-orange-700 hover:text-orange-800 hover:underline">
            Forgot password?
          </a>
        </p>

        {/* Social login */}
        <div className="flex items-center gap-3 my-2">
          <div className="h-px bg-gray-200 flex-1" />
          <span className="text-xs text-gray-500">or</span>
          <div className="h-px bg-gray-200 flex-1" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            className="flex items-center justify-center gap-2 border border-gray-300 rounded-lg px-4 py-2.5 hover:bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-200"
          >
            <Image src="/images/googleLogo.png" alt="Google" width={20} height={20} />
            <span className="text-sm font-medium">Google</span>
          </button>
          <button
            type="button"
            className="flex items-center justify-center gap-2 border border-gray-300 rounded-lg px-4 py-2.5 hover:bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-200"
          >
            <Image src="/images/facebookLogo.png" alt="Facebook" width={20} height={20} />
            <span className="text-sm font-medium">Facebook</span>
          </button>
        </div>
      </form>
    </div>
  );
}
