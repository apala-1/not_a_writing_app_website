'use client';

import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LoginData, loginSchema } from "@/app/(auth)/schema";
import { handleLogin } from "@/lib/actions/auth-action";
import { setToken } from "@/lib/auth/storage";
import { login } from "@/lib/api/auth";
import Script from "next/script";

declare global {
  interface Window {
    google: any;
  }
}

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [globalSuccess, setGlobalSuccess] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    mode: "onSubmit",
  });

  const onSubmit = async (values: LoginData) => {
  setGlobalError(null);
  setGlobalSuccess(null);

  try {
    await login(values);
    setGlobalSuccess("Login successful! Redirecting...");

    setTimeout(() => {
      router.push("/user/dashboard");
    }, 1500);
  } catch (err: any) {
    setGlobalError(err.message || "Login failed");
  }
};

const handleGoogleResponse = async (response: any) => {
    try {
      const res = await fetch("http://localhost:3000/api/v1/auth/google-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ idToken: response.credential }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      router.push("/user/dashboard");
    } catch (err: any) {
      setGlobalError(err.message);
    }
  };

  useEffect(() => {
  const interval = setInterval(() => {
    if (window.google && document.getElementById("googleBtn")) {
      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_WEB_CLIENT_ID,
        callback: handleGoogleResponse,
      });

      window.google.accounts.id.renderButton(
        document.getElementById("googleBtn"),
        {
          theme: "outline",
          size: "large",
          width: 250,
        }
      );

      clearInterval(interval);
    }
  }, 200);

  return () => clearInterval(interval);
}, []);

  return (
    <>
    <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
      />
    <div className="bg-white/95 backdrop-blur-sm p-8 sm:p-10 rounded-2xl shadow-xl w-full max-w-md border border-orange-100">
      {/* Header */}
      <div className="grid grid-cols-3 items-center mb-6">
        <button
          type="button"
          onClick={() => router.push('/')}
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

      <div className="h-px bg-orange-100 mb-6" />

      {/* Success Bar */}
      {globalSuccess && (
        <div className="mb-4 p-3 rounded bg-green-50 border border-green-200 text-center">
          <p className="text-sm text-green-600 font-medium">{globalSuccess}</p>
        </div>
      )}

      {/* Error Bar */}
      {globalError && (
        <div className="mb-4 p-3 rounded bg-red-50 border border-red-200 text-center">
          <p className="text-sm text-red-600 font-medium">{globalError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Email Field */}
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
          <input
            {...register("email")}
            id="email"
            type="email"
            placeholder="you@example.com"
            className={`w-full border rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.email && <p className="text-xs text-red-600">{errors.email.message}</p>}
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
          <div className="relative">
            <input
              {...register("password")}
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className={`w-full border rounded-lg px-4 py-3 pr-10 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-orange-600 transition"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>
          {errors.password && <p className="text-xs text-red-600">{errors.password.message}</p>}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={pending}
          className="w-full bg-orange-500 text-white font-semibold py-3 rounded-lg hover:bg-orange-600 transition focus:outline-none focus:ring-2 focus:ring-orange-300 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {pending ? "Logging in..." : "Login"}
        </button>

        <p className="text-center text-sm">
          <Link href="/forgotPass" className="text-orange-700 hover:text-orange-800 hover:underline">
            Forgot password?
          </Link>
        </p>

        {/* Social login divider */}
        <div className="flex items-center gap-3 my-2">
          <div className="h-px bg-gray-200 flex-1" />
          <span className="text-xs text-gray-500">or</span>
          <div className="h-px bg-gray-200 flex-1" />
        </div>

        <div className="grid grid-cols-2 gap-3">
  <div id="googleBtn" className="flex justify-center col-span-1" />

  <button
    type="button"
    className="flex items-center justify-center gap-2 border border-gray-300 rounded-lg px-4 py-2.5 hover:bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-200"
  >
    <Image src="/images/facebookLogo.png" alt="Facebook" width={20} height={20} />
    <span className="text-sm font-medium">Facebook</span>
  </button>
</div>

        <p className="text-center text-sm text-gray-600 mt-4">
          Don't have an account?{" "}
          <Link href="/register" className="text-orange-700 font-semibold hover:underline">
            Sign up
          </Link>
        </p>
      </form>
    </div>
    </>
  );
}
