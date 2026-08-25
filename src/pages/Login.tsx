import React, { useState } from "react";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginBrother } from "../services/user";
import { useDispatch } from "react-redux";
import { login } from "../features/userProfileSlice";

const brotherSchema = z.object({
  phoneNumber: z
    .string()
    .regex(/^[0-9]+$/, "Please enter valid digits only")
    .min(10, "Phone number must be at least 10 digits")
    .max(12, "Phone number cannot exceed 12 digits"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const sisterSchema = z.object({
  phoneNumber: z
    .string()
    .regex(/^[0-9]+$/, "Please enter valid digits only")
    .min(10, "Phone number must be at least 10 digits")
    .max(12, "Phone number cannot exceed 12 digits"),
  otp: z
    .string()
    .length(6, "OTP must be exactly 6 digits")
    .regex(/^[0-9]+$/, "Digits only"),
});

type BrotherInputs = z.infer<typeof brotherSchema>;
type SisterInputs = z.infer<typeof sisterSchema>;

const Login = () => {
    
  const [role, setRole] = useState<"brother" | "sister">("brother");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Brother Form
  const {
    register: registerBrother,
    handleSubmit: handleSubmitBrother,
    formState: { errors: brotherErrors },
    reset: resetBrother,
  } = useForm<BrotherInputs>({ resolver: zodResolver(brotherSchema) });

  // Sister Form
  const {
    register: registerSister,
    handleSubmit: handleSubmitSister,
    formState: { errors: sisterErrors },
    reset: resetSister,
  } = useForm<SisterInputs>({ resolver: zodResolver(sisterSchema) });

  const handleRoleChange = (newRole: "brother" | "sister") => {
    setRole(newRole);
    setError("");
    resetBrother();
    resetSister();
  };

  const onBrotherSubmit: SubmitHandler<BrotherInputs> = async (data) => {
    try {
      setIsSubmitting(true);
      setError("");
      
      const response = await loginBrother(data);
      const userData = response.data;       
      dispatch(login(userData));           
      navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to log in as Brother. Please check your credentials.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSisterSubmit: SubmitHandler<SisterInputs> = async (data) => {
    try {
      setIsSubmitting(true);
      setError("");
      // Mock login for sister
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("Sister logged in:", data);
      alert("Welcome back, sister!");
      navigate("/");
    } catch (err: any) {
      setError("Login failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-white to-amber-50 p-4 font-sans relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-rose-200 opacity-40 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-amber-200 opacity-40 blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md bg-white/70 backdrop-blur-xl border border-white rounded-3xl shadow-xl p-8 relative z-10">
        <div className="text-center mb-8">
          <Link
            to="/"
            className="inline-block text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-amber-500 mb-2"
          >
            🪔 RakhiPay
          </Link>
          <h2 className="text-2xl font-bold text-gray-800">Welcome Back</h2>
          <p className="text-gray-500 mt-2">Log in to continue celebrating.</p>
        </div>

        {/* Role Toggle */}
        <div className="flex bg-white/50 p-1 rounded-xl mb-8 border border-rose-100 shadow-inner">
          <button
            onClick={() => handleRoleChange("brother")}
            className={`flex-1 py-2 rounded-lg font-medium transition-all ${
              role === "brother"
                ? "bg-rose-500 text-white shadow-md"
                : "text-gray-500 hover:text-rose-600"
            }`}
          >
            I am a Brother
          </button>
          <button
            onClick={() => handleRoleChange("sister")}
            className={`flex-1 py-2 rounded-lg font-medium transition-all ${
              role === "sister"
                ? "bg-amber-500 text-white shadow-md"
                : "text-gray-500 hover:text-amber-600"
            }`}
          >
            I am a Sister
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
            {error}
          </div>
        )}

        {role === "brother" ? (
          <form onSubmit={handleSubmitBrother(onBrotherSubmit)} className="space-y-5">
            {/* Phone Number Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-4 py-3 rounded-l-xl border border-r-0 border-gray-200 bg-gray-50 text-gray-500 font-medium">
                  +91
                </span>
                <input
                  type="tel"
                  placeholder="9876543210"
                  className={`w-full px-4 py-3 rounded-r-xl border bg-white/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-400 transition-colors ${
                    brotherErrors.phoneNumber ? "border-red-400" : "border-gray-200"
                  }`}
                  {...registerBrother("phoneNumber")}
                />
              </div>
              {brotherErrors.phoneNumber && (
                <p className="text-red-500 text-sm mt-1">{brotherErrors.phoneNumber.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className={`w-full px-4 py-3 rounded-xl border bg-white/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-400 transition-colors ${
                  brotherErrors.password ? "border-red-400" : "border-gray-200"
                }`}
                {...registerBrother("password")}
              />
              {brotherErrors.password && (
                <p className="text-red-500 text-sm mt-1">{brotherErrors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 rounded-xl text-white font-medium bg-rose-500 hover:bg-rose-600 shadow-md transform transition hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70"
            >
              {isSubmitting ? "Logging in..." : "Log In as Brother"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleSubmitSister(onSisterSubmit)} className="space-y-5">
            {/* Phone Number Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-4 py-3 rounded-l-xl border border-r-0 border-gray-200 bg-gray-50 text-gray-500 font-medium">
                  +91
                </span>
                <input
                  type="tel"
                  placeholder="9876543210"
                  className={`w-full px-4 py-3 rounded-r-xl border bg-white/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 transition-colors ${
                    sisterErrors.phoneNumber ? "border-red-400" : "border-gray-200"
                  }`}
                  {...registerSister("phoneNumber")}
                />
              </div>
              {sisterErrors.phoneNumber && (
                <p className="text-red-500 text-sm mt-1">{sisterErrors.phoneNumber.message}</p>
              )}
            </div>

            {/* OTP Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                OTP (One Time Password)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="123456"
                  maxLength={6}
                  className={`flex-1 px-4 py-3 rounded-xl border bg-white/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 transition-colors ${
                    sisterErrors.otp ? "border-red-400" : "border-gray-200"
                  }`}
                  {...registerSister("otp")}
                />
                <button
                  type="button"
                  className="px-4 py-3 rounded-xl border border-amber-200 text-amber-600 font-medium bg-amber-50 hover:bg-amber-100 transition-colors whitespace-nowrap"
                >
                  Send OTP
                </button>
              </div>
              {sisterErrors.otp && (
                <p className="text-red-500 text-sm mt-1">{sisterErrors.otp.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 rounded-xl text-white font-medium bg-amber-500 hover:bg-amber-600 shadow-md transform transition hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70"
            >
              {isSubmitting ? "Logging in..." : "Log In as Sister"}
            </button>
          </form>
        )}

        {role === "brother" && (
          <p className="text-center text-gray-500 text-sm mt-8">
            Don't have an account?{" "}
            <Link
              to="/auth/register-brother"
              className="text-rose-600 font-medium hover:underline"
            >
              Sign up here
            </Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
