import { useState } from "react";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerBrother } from "../services/user";

// Define the validation schema using Zod
const registerSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name cannot exceed 100 characters"),
  phoneNumber: z
    .string()
    .regex(/^[0-9]+$/, "Please enter valid digits only")
    .min(10, "Phone number must be at least 10 digits")
    .max(12, "Phone number cannot exceed 12 digits"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Infer the type for the form fields from the schema
type RegisterFormInputs = z.infer<typeof registerSchema>;

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormInputs>({
    resolver: zodResolver(registerSchema),
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Function for registration
  const onSubmit: SubmitHandler<RegisterFormInputs> = async (data) => {
    try {
      setIsSubmitting(true);
      setError("");
      await registerBrother(data);
     console.log("registered successfully!");
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to register. Please try again.");
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
          <h2 className="text-2xl font-bold text-gray-800">
            Create an Account
          </h2>
          <p className="text-gray-500 mt-2">
            Join us to celebrate the bond of protection.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Name Field */}
          <div>
            <label
              className="block text-sm font-medium text-gray-700 mb-1"
              htmlFor="name"
            >
              Full Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="e.g. Rahul Sharma"
              className={`w-full px-4 py-3 rounded-xl border bg-white/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-400 transition-colors ${
                errors.name ? "border-red-400" : "border-gray-200"
              }`}
              {...register("name")}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Phone Number Field */}
          <div>
            <label
              className="block text-sm font-medium text-gray-700 mb-1"
              htmlFor="phoneNumber"
            >
              Phone Number
            </label>
            <div className="flex">
              <span className="inline-flex items-center px-4 py-3 rounded-l-xl border border-r-0 border-gray-200 bg-gray-50 text-gray-500 font-medium">
                +91
              </span>
              <input
                id="phoneNumber"
                type="tel"
                placeholder="9876543210"
                className={`w-full px-4 py-3 rounded-r-xl border bg-white/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-400 transition-colors ${
                  errors.phoneNumber ? "border-red-400" : "border-gray-200"
                }`}
                {...register("phoneNumber")}
              />
            </div>
            {errors.phoneNumber && (
              <p className="text-red-500 text-sm mt-1">
                {errors.phoneNumber.message}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label
              className="block text-sm font-medium text-gray-700 mb-1"
              htmlFor="password"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              className={`w-full px-4 py-3 rounded-xl border bg-white/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-400 transition-colors ${
                errors.password ? "border-red-400" : "border-gray-200"
              }`}
              {...register("password")}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-4 rounded-xl text-white font-medium bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 shadow-md transform transition hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-gray-500 text-sm mt-8">
          Already have an account?{" "}
          <Link
            to="/auth/login"
            className="text-rose-600 font-medium hover:underline"
          >
            Log in here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
