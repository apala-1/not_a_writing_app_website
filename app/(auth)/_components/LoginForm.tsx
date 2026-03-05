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
  const [googleLoading, setGoogleLoading] = useState(false);
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
    const res = await login(values); // returns { success, message, data: { token, user } }
    const { user, token } = res.data;

    setToken(token); // save token if you use it

    setGlobalSuccess("Login successful! Redirecting...");

    setTimeout(() => {
      if (user.role === "admin") {
        router.push("/admin/users");
      } else {
        router.push("/user/dashboard");
      }
    }, 1500);
  } catch (err: any) {
    setGlobalError(err.message || "Login failed");
  }
};

  const handleGoogleResponse = async (response: any) => {
  setGlobalError(null);
  setGlobalSuccess(null);
  setGoogleLoading(true);

  try {
    const res = await fetch("http://localhost:3000/api/v1/auth/google-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ idToken: response.credential }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message);

    setGlobalSuccess("Google login successful! Redirecting...");

    setTimeout(() => {
      router.push("/user/dashboard");
    }, 1500);

  } catch (err: any) {
    setGlobalError(err.message || "Google login failed");
  } finally {
    setGoogleLoading(false);
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
            width: "100%",
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
      
      {/* Full screen gradient background */}
      <div className="min-h-screen w-full bg-gradient-to-br from-orange-50 via-amber-50 to-rose-50 flex items-center justify-center p-4 relative overflow-hidden">
        
        {/* Animated background blobs */}
        <div className="absolute top-0 -left-4 w-72 h-72 bg-orange-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-rose-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-amber-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>

        {/* Main container with two-column layout */}
        <div className="w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 items-center relative z-10">
          
          {/* Left side - Branding & Image */}
          <div className="hidden lg:flex flex-col justify-center space-y-8 px-8">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-rose-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xl font-bold">HI</span>
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-rose-600 bg-clip-text text-transparent">
                  Not A Writing App
                </span>
              </div>
              
              <h1 className="text-5xl font-extrabold text-gray-900 leading-tight">
                Welcome back to
                <span className="block bg-gradient-to-r from-orange-600 via-rose-500 to-amber-600 bg-clip-text text-transparent">
                  something amazing
                </span>
              </h1>
              
              <p className="text-lg text-gray-600 leading-relaxed max-w-md">
                Sign in to access your personalized dashboard and continue your journey with us. Your success story continues here.
              </p>

              <div className="flex items-center gap-4 pt-4">
                <div className="flex -space-x-3">
                  <div className="w-12 h-12 rounded-full border-4 border-white bg-gradient-to-br from-orange-400 to-rose-400"></div>
                  <div className="w-12 h-12 rounded-full border-4 border-white bg-gradient-to-br from-amber-400 to-orange-400"></div>
                  <div className="w-12 h-12 rounded-full border-4 border-white bg-gradient-to-br from-rose-400 to-amber-400"></div>
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-semibold text-gray-900">10,000+</span> users trust us
                </div>
              </div>
            </div>

            {/* Decorative illustration placeholder */}
            <div className="relative w-full h-80 bg-gradient-to-br from-orange-100 to-rose-100 rounded-3xl shadow-2xl overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center space-y-4 p-8">
                  <div className="w-32 h-32 mx-auto bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <svg className="w-16 h-16 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <p className="text-white font-semibold text-lg drop-shadow-lg">Secure & Trusted</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Login Form */}
          <div className="flex items-center justify-center">
            <div className="bg-white/90 backdrop-blur-xl p-8 sm:p-12 rounded-3xl shadow-2xl w-full max-w-md border border-white/20 transform transition-all hover:shadow-3xl">
              
              {/* Header */}
              <div className="mb-8">
                {/* Mobile logo */}
                <div className="lg:hidden flex justify-center mb-6">
                  <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-rose-500 px-5 py-2 rounded-full shadow-lg">
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                      <span className="text-orange-600 text-lg font-bold">NAWA</span>
                    </div>
                    <span className="text-white font-bold text-lg">Not A Writing App</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => router.push('/')}
                  className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-orange-700 bg-orange-50 hover:bg-orange-100 hover:text-orange-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-300 group"
                >
                  <span className="text-lg transform group-hover:-translate-x-1 transition-transform duration-200">←</span>
                  <span className="text-sm font-medium">Back to Home</span>
                </button>

                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                  Welcome back
                </h2>
                <p className="text-gray-600">Please enter your credentials to continue</p>
              </div>

              {/* Success Alert */}
              {globalSuccess && (
                <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 animate-fade-in">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-sm text-green-700 font-medium">{globalSuccess}</p>
                  </div>
                </div>
              )}

              {/* Error Alert */}
              {globalError && (
                <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 animate-fade-in">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                    <p className="text-sm text-red-700 font-medium">{globalError}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Email Field */}
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                    Email Address
                  </label>
                  <input
                    {...register("email")}
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    className={`w-full border-2 rounded-xl px-4 py-3.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-orange-100 transition-all duration-200 ${
                      errors.email ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50/50 hover:border-orange-300 focus:border-orange-400 focus:bg-white"
                    }`}
                  />
                  {errors.email && (
                    <p className="text-xs text-red-600 flex items-center gap-1 mt-1">
                      <span>⚠️</span> {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Password
                  </label>
                  <div className="relative">
                    <input
                      {...register("password")}
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className={`w-full border-2 rounded-xl px-4 py-3.5 pr-12 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-orange-100 transition-all duration-200 ${
                        errors.password ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50/50 hover:border-orange-300 focus:border-orange-400 focus:bg-white"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-orange-600 transition-colors duration-200 rounded-lg hover:bg-orange-50"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-xs text-red-600 flex items-center gap-1 mt-1">
                      <span>⚠️</span> {errors.password.message}
                    </p>
                  )}
                </div>

                {/* Forgot Password */}
                <div className="text-right">
                  <Link 
                    href="/forgotPass" 
                    className="text-sm font-medium text-orange-600 hover:text-orange-700 hover:underline transition-colors duration-200"
                  >
                    Forgot password?
                  </Link>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={pending}
                  className="w-full bg-gradient-to-r from-orange-500 via-rose-500 to-amber-500 text-white font-bold py-4 rounded-xl hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-orange-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 relative overflow-hidden group"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {pending ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Signing you in...
                      </>
                    ) : (
                      <>
                        Sign In
                        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </>
                    )}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-600 via-rose-600 to-amber-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                </button>

                {/* Social Login Divider */}
                <div className="relative py-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500 font-medium">Or continue with</span>
                  </div>
                </div>

                {googleLoading && (
                  <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 animate-fade-in">
                    <div className="flex items-center gap-3">
                      <svg className="animate-spin h-5 w-5 text-blue-600" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                      </svg>
                      <p className="text-sm text-blue-700 font-medium">
                        Signing in with Google...
                      </p>
                    </div>
                  </div>
                )}

                {/* Social Login Buttons */}
                <div className="grid grid-cols-2 gap-4">
                  <div id="googleBtn" className="col-span-2" />

                  <button
                    type="button"
                    className="col-span-2 flex items-center justify-center gap-3 border-2 border-gray-200 bg-white rounded-xl px-4 py-3.5 hover:bg-gray-50 hover:border-blue-300 hover:shadow-md text-gray-700 font-medium focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all duration-200 group"
                  >
                    <div className="w-6 h-6 bg-blue-600 rounded-md flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    </div>
                    <span className="text-sm group-hover:text-blue-600 transition-colors duration-200">Continue with Facebook</span>
                  </button>
                </div>

                {/* Sign Up Link */}
                <p className="text-center text-sm text-gray-600 pt-4">
                  Don't have an account?{" "}
                  <Link 
                    href="/register" 
                    className="font-bold text-orange-600 hover:text-orange-700 hover:underline transition-colors duration-200"
                  >
                    Create account
                  </Link>
                </p>
              </form>

              {/* Trust Indicators */}
              <div className="mt-8 pt-6 border-t border-gray-100">
                <div className="flex items-center justify-center gap-6 text-xs text-gray-500">
                  <div className="flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span>Secure Login</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span>SSL Encrypted</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </>
  );
}