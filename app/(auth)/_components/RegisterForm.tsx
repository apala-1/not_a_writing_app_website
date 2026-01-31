'use client';
import { startTransition, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { RegisterData, registerSchema } from "@/app/(auth)/schema";
import { zodResolver } from "@hookform/resolvers/zod"
import Image from "next/image";
import { useRouter } from "next/navigation";
import { handleRegister } from "@/lib/actions/auth-action";

export default function RegisterForm() {
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [globalSuccess, setGlobalSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [pending, setTransition] = useTransition();
  const router = useRouter();

  // first, we initialize the react hook form
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
    mode: "onSubmit",
  })

  // next, we define the submit handler
  const onSubmit = async (values: RegisterData) => {
    setGlobalError(null);
    setGlobalSuccess(null);

    startTransition(async () => {
      try {
        const response = await handleRegister(values);

        if(!response.success){
          setGlobalError(response.message || "Registration failed");
          return;
        }

        // if success, we redirect to login form
        setGlobalSuccess("Account created successfully! Redirecting to login...");
        setTimeout(() => { router.push("/login"); }, 1500);
      } catch (err: any) {
        setGlobalError(err.message || "An unexpected error occured");
      }
    });
  };

  return (
    <div className="bg-white/95 backdrop-blur-sm p-8 sm:p-10 rounded-2xl shadow-xl w-full max-w-md border border-orange-100">
      <div className="grid grid-cols-3 items-center mb-6">
        <button
          onClick={() => router.back()}
          className="justify-self-start flex items-center gap-2 px-3 py-1.5 rounded-md text-orange-700 bg-orange-50 hover:bg-orange-100 hover:text-orange-800 transition focus:outline-none focus:ring-2 focus:ring-orange-300"
        >
          <span className="text-base">←</span>
          <span className="text-sm font-medium">Back</span>
        </button>

        <h2 className="justify-self-center text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
          Register
        </h2>

        <div className="justify-self-end w-16 h-6" aria-hidden />
      </div>

      {/* Divider */}
      <div className="h-px bg-orange-100 mb-6" />
      {/* Success Bar */} 
      {globalSuccess && ( <div className="mb-4 p-3 rounded bg-green-50 border border-green-200 text-center"> <p className="text-sm text-green-600 font-medium">{globalSuccess}</p> </div> )} 
      {/* Error Bar */} 
      {globalError && ( <div className="mb-4 p-3 rounded bg-red-50 border border-red-200 text-center"> <p className="text-sm text-red-600 font-medium">{globalError}</p> </div> )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

        <div className="space-y-2">
          <label htmlFor="firstName" className="text-sm font-medium text-gray-700">Firstname</label>
          <input
          {...register("firstName")}
            id="firstName"
            name="firstName"
            type="text"
            placeholder="Your firstname"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition"
          />
          {errors.firstName && <p className="text-sm text-red-600">{errors.firstName.message}</p>}
        </div>

        <div className="space-y-2">
          <label htmlFor="lastName" className="text-sm font-medium text-gray-700">Lastname</label>
          <input
          {...register("lastName")}
            id="lastName"
            name="lastName"
            type="text"
            placeholder="Your lastname"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition"
          />
          {errors.lastName && <p className="text-sm text-red-600">{errors.lastName.message}</p>}
        </div>

        <div className="space-y-2">
          <label htmlFor="username" className="text-sm font-medium text-gray-700">Username</label>
          <input
          {...register("username")}
            id="username"
            name="username"
            type="text"
            placeholder="Your username"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition"
          />
          {errors.username && <p className="text-sm text-red-600">{errors.username.message}</p>}
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
          <input
          {...register("email")}
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition"
          />
          {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
          <div className="relative">
            <input
            {...register("password")}
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
          {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
        </div>

        <div className="relative space-y-1">
  <label
    className="text-sm font-medium text-gray-700"
    htmlFor="confirmPassword"
  >
    Confirm password
  </label>

  <input
    id="confirmPassword"
    type={showConfirmPassword ? "text" : "password"} 
    autoComplete="new-password"
    className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-10 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition"
    {...register("confirmPassword")}
    placeholder="••••••"
  />

  <button
    type="button"
    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
    className="absolute right-3 top-[2.6rem] text-gray-500 hover:text-orange-600 transition"
    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
    title={showConfirmPassword ? "Hide password" : "Show password"}
  >
    {showConfirmPassword ? "🙈" : "👁️"}
  </button>

  {errors.confirmPassword?.message && (
    <p className="text-xs text-red-600">{errors.confirmPassword.message}</p>
  )}
</div>


        <button
          type="submit"
          disabled={isSubmitting || pending}
          className="w-full bg-orange-500 text-white font-semibold py-3 rounded-lg hover:bg-orange-600 transition focus:outline-none focus:ring-2 focus:ring-orange-300"
        >
          {isSubmitting || pending ? "Creating Account..." : "Create Account"}
        </button>

        {/* Already have an account */}
        <p className="text-center text-sm text-gray-700">
          Already have an account?{" "}
          <a href="/auth/login" className="text-orange-700 hover:text-orange-800 hover:underline font-medium">
            Log In
          </a>
        </p>

        {/* Social signup */}
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
