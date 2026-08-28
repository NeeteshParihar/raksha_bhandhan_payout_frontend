import { useState } from "react";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerUser } from "../services/user";
import { useDispatch } from "react-redux";
import { login } from "../features/userProfileSlice";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";

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
  role: z.enum(["BROTHER", "SISTER"]),
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
  const dispatch = useDispatch();

  // Function for registration
  const onSubmit: SubmitHandler<RegisterFormInputs> = async (data) => {
    try {
      setIsSubmitting(true);
      setError("");
      const response = await registerUser(data);
      console.log("registered successfully!");
      if (response.success && response.data) {
        dispatch(login(response.data));
      }
      
      if (data.role === 'BROTHER') {
        navigate('/dashboard');
      } else {
        navigate('/sisterDashboard');
      }
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
          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              I am a...
            </label>
            <div className="flex gap-4">
              <label className="flex-1 cursor-pointer relative">
                <input
                  type="radio"
                  value="BROTHER"
                  className="peer sr-only"
                  {...register("role")}
                />
                <div className="text-center px-4 py-3 rounded-xl border bg-white/50 text-gray-600 font-medium transition-all peer-checked:border-rose-500 peer-checked:bg-rose-50 peer-checked:text-rose-700 peer-focus:ring-2 peer-focus:ring-rose-400 hover:bg-white">
                  Brother
                </div>
              </label>
              <label className="flex-1 cursor-pointer relative">
                <input
                  type="radio"
                  value="SISTER"
                  className="peer sr-only"
                  {...register("role")}
                />
                <div className="text-center px-4 py-3 rounded-xl border bg-white/50 text-gray-600 font-medium transition-all peer-checked:border-amber-500 peer-checked:bg-amber-50 peer-checked:text-amber-700 peer-focus:ring-2 peer-focus:ring-amber-400 hover:bg-white">
                  Sister
                </div>
              </label>
            </div>
            {errors.role && (
              <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>
            )}
          </div>

          {/* Name Field */}
          <Input
            id="name"
            label="Full Name"
            type="text"
            placeholder="e.g. Rahul Sharma"
            error={errors.name?.message}
            {...register("name")}
          />

          {/* Phone Number Field */}
          <Input
            id="phoneNumber"
            label="Phone Number"
            type="tel"
            placeholder="9876543210"
            prefix="+91"
            error={errors.phoneNumber?.message}
            {...register("phoneNumber")}
          />

          {/* Password Field */}
          <Input
            id="password"
            label="Password"
            type="password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register("password")}
          />

          <Button
            type="submit"
            isLoading={isSubmitting}
            className="w-full bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white"
          >
            Sign Up
          </Button>
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
