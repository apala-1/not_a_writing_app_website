"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { RegisterData, registerSchema } from "@/app/(auth)/schema";
import { register as registerUser } from "@/lib/api/auth";

export default function RegisterForm() {
  console.log("Form mounted");
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [globalSuccess, setGlobalSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
    mode: "onSubmit",
  });

  const onSubmit = async (values: RegisterData) => {
     console.log("onSubmit fired!", values);
    setGlobalError(null);
    setGlobalSuccess(null);

    startTransition(async () => {
      try {
        // Backend expects name as a single field
        const payload = {
          name: `${values.firstName} ${values.lastName}`,
          email: values.email,
          password: values.password,
          confirmPassword: values.confirmPassword,
        };

        const response = await registerUser(payload);

        if (response.success) {
          setGlobalSuccess("Account created successfully! Redirecting to login...");
          setTimeout(() => router.push("/login"), 1500);
        } else {
          setGlobalError(response.message || "Registration failed");
        }
      } catch (err: any) {
        setGlobalError(err.message || "Registration failed");
      }
    });
  };

  return (
    <div className="bg-white/95 backdrop-blur-sm p-8 sm:p-10 rounded-2xl shadow-xl w-full max-w-md border border-orange-100">
      <div className="grid grid-cols-3 items-center mb-6">
        <button
          onClick={() => router.back()}
          className="justify-self-start flex items-center gap-2 px-3 py-1.5 rounded-md text-orange-700 bg-orange-50 hover:bg-orange-100 transition"
        >
          ← Back
        </button>

        <h2 className="justify-self-center text-2xl sm:text-3xl font-bold text-black">
          Register
        </h2>

        <div />
      </div>

      <div className="h-px bg-orange-100 mb-6" />

      {globalSuccess && (
        <div className="mb-4 p-3 rounded bg-green-50 border border-green-200 text-center">
          <p className="text-sm text-black font-medium">{globalSuccess}</p>
        </div>
      )}

      {globalError && (
        <div className="mb-4 p-3 rounded bg-red-50 border border-red-200 text-center">
          <p className="text-sm text-black font-medium">{globalError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 text-black">
        <input
          {...register("firstName")}
          placeholder="First Name"
          className="w-full border border-gray-300 rounded-lg px-4 py-3 text-black placeholder-black focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
        />
        {errors.firstName && <p className="text-xs text-black">{errors.firstName.message}</p>}

        <input
          {...register("lastName")}
          placeholder="Last Name"
          className="w-full border border-gray-300 rounded-lg px-4 py-3 text-black placeholder-black focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
        />
        {errors.lastName && <p className="text-xs text-black">{errors.lastName.message}</p>}

        <input
          {...register("email")}
          placeholder="Email"
          className="w-full border border-gray-300 rounded-lg px-4 py-3 text-black placeholder-black focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
        />
        {errors.email && <p className="text-xs text-black">{errors.email.message}</p>}

        <div className="relative">
          <input
            {...register("password")}
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-10 text-black placeholder-black focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-black"
          >
            {showPassword ? "🙈" : "👁️"}
          </button>
        </div>
        {errors.password && <p className="text-xs text-black">{errors.password.message}</p>}

        <div className="relative">
          <input
            {...register("confirmPassword")}
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-10 text-black placeholder-black focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-3 text-black"
          >
            {showConfirmPassword ? "🙈" : "👁️"}
          </button>
        </div>
        {errors.confirmPassword && <p className="text-xs text-black">{errors.confirmPassword.message}</p>}

        <button
          type="submit"
          disabled={pending}
          className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 disabled:opacity-70"
        >
          {pending ? "Creating Account..." : "Create Account"}
        </button>

        <p className="text-center text-black text-sm">
          Already have an account?{" "}
          <a href="/login" className="text-orange-700 hover:underline">
            Log in
          </a>
        </p>

        <div className="flex items-center gap-3 my-2">
          <div className="h-px bg-gray-200 flex-1" />
          <span className="text-xs text-black">or</span>
          <div className="h-px bg-gray-200 flex-1" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button type="button" className="flex items-center justify-center gap-2 border border-gray-300 rounded-lg px-4 py-2.5 hover:bg-gray-50 text-black">
            <Image src="/images/googleLogo.png" alt="Google" width={20} height={20} />
            Google
          </button>
          <button type="button" className="flex items-center justify-center gap-2 border border-gray-300 rounded-lg px-4 py-2.5 hover:bg-gray-50 text-black">
            <Image src="/images/facebookLogo.png" alt="Facebook" width={20} height={20} />
            Facebook
          </button>
        </div>
      </form>
    </div>
  );
}
