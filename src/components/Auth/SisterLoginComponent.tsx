import React, { useState, useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch } from "react-redux";
import { loginUser, getOtp, loginByOtp } from "../../services/user";
import { login } from "../../features/userProfileSlice";

const passwordSchema = z.object({
  phoneNumber: z
    .string()
    .regex(/^[0-9]+$/, "Please enter valid digits only")
    .min(10, "Phone number must be at least 10 digits")
    .max(12, "Phone number cannot exceed 12 digits"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const otpSchema = z.object({
  phoneNumber: z
    .string()
    .regex(/^[0-9]+$/, "Please enter valid digits only")
    .min(10, "Phone number must be at least 10 digits")
    .max(12, "Phone number cannot exceed 12 digits"),
  otp: z
    .string()
    .length(6, "OTP must be exactly 6 digits")
});

type PasswordInputs = z.infer<typeof passwordSchema>;
type OtpInputs = z.infer<typeof otpSchema>;

export const SisterLoginComponent = () => {
  const role = "SISTER";
  const [loginMethod, setLoginMethod] = useState<"PASSWORD" | "OTP">("PASSWORD");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else if (resendTimer === 0 && otpSent) {
      setOtpSent(false); // allow sending again
    }
    return () => clearInterval(interval);
  }, [resendTimer, otpSent]);
  
  const dispatch = useDispatch();

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
    reset: resetPassword,
  } = useForm<PasswordInputs>({ resolver: zodResolver(passwordSchema) });

  const {
    register: registerOtp,
    handleSubmit: handleOtpSubmit,
    formState: { errors: otpErrors },
    reset: resetOtp,
    getValues: getOtpValues,
    trigger: triggerOtpValidation
  } = useForm<OtpInputs>({ resolver: zodResolver(otpSchema) });

  const handleMethodChange = (newMethod: "PASSWORD" | "OTP") => {
    setLoginMethod(newMethod);
    setError("");
    resetPassword();
  };

  const onPasswordSubmit: SubmitHandler<PasswordInputs> = async (data) => {
    try {
      setIsSubmitting(true);
      setError("");
      
      const response = await loginUser({
        phoneNumber: data.phoneNumber,
        password: data.password,
        role: role
      });
      const userData = response.data;       
      dispatch(login(userData));           
      // Note: No navigation, just update redux state
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || `Failed to log in as ${role}. Please check your credentials.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendOtp = async () => {
    const isPhoneValid = await triggerOtpValidation("phoneNumber");
    if (!isPhoneValid) return;

    try {
      setError("");
      setIsSubmitting(true);
      const phone = getOtpValues("phoneNumber");
      const res = await getOtp(phone);
      setOtpSent(true);
      
      const minutes = res?.minutes || 5;
      setResendTimer(minutes * 60);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to send OTP.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onOtpSubmit: SubmitHandler<OtpInputs> = async (data) => {
    try {
      setIsSubmitting(true);
      setError("");
      
      const response = await loginByOtp({
        phoneNumber: data.phoneNumber,
        otp: data.otp,
        role: role
      });
      
      const userData = response.data;
      dispatch(login(userData));
      // Note: No navigation, just update redux state
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "OTP Login failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="w-full max-w-md bg-white/70 backdrop-blur-xl border border-white rounded-3xl shadow-xl p-8 relative z-10">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Sister Login</h2>
        <p className="text-gray-500 mt-2">Log in to view and play your quiz.</p>
      </div>

      {/* Method Toggle */}
      <div className="flex justify-center mb-6 space-x-4">
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="radio"
            checked={loginMethod === "PASSWORD"}
            onChange={() => handleMethodChange("PASSWORD")}
            className="text-amber-500 focus:ring-amber-400 h-4 w-4"
          />
          <span className="text-sm font-medium text-gray-700">Password</span>
        </label>
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="radio"
            checked={loginMethod === "OTP"}
            onChange={() => handleMethodChange("OTP")}
            className="text-amber-500 focus:ring-amber-400 h-4 w-4"
          />
          <span className="text-sm font-medium text-gray-700">OTP</span>
        </label>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
          {error}
        </div>
      )}

      {loginMethod === "PASSWORD" ? (
        <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-5">
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
                  passwordErrors.phoneNumber ? "border-red-400" : "border-gray-200"
                }`}
                {...registerPassword("phoneNumber")}
              />
            </div>
            {passwordErrors.phoneNumber && (
              <p className="text-red-500 text-sm mt-1">{passwordErrors.phoneNumber.message}</p>
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
              className={`w-full px-4 py-3 rounded-xl border bg-white/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 transition-colors ${
                passwordErrors.password ? "border-red-400" : "border-gray-200"
              }`}
              {...registerPassword("password")}
            />
            {passwordErrors.password && (
              <p className="text-red-500 text-sm mt-1">{passwordErrors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-4 rounded-xl text-white font-medium shadow-md transform transition hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 bg-amber-500 hover:bg-amber-600"
          >
            {isSubmitting ? "Logging in..." : "Log In as Sister"}
          </button>
        </form>
      ) : (
        <form onSubmit={handleOtpSubmit(onOtpSubmit)} className="space-y-5">
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
                  otpErrors.phoneNumber ? "border-red-400" : "border-gray-200"
                }`}
                {...registerOtp("phoneNumber")}
              />
            </div>
            {otpErrors.phoneNumber && (
              <p className="text-red-500 text-sm mt-1">{otpErrors.phoneNumber.message}</p>
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
                  otpErrors.otp ? "border-red-400" : "border-gray-200"
                }`}
                {...registerOtp("otp")}
              />
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={isSubmitting || resendTimer > 0}
                className="px-4 py-3 rounded-xl border border-amber-200 text-amber-600 font-medium bg-amber-50 hover:bg-amber-100 transition-colors whitespace-nowrap disabled:opacity-50"
              >
                {resendTimer > 0 ? `Resend in ${formatTime(resendTimer)}` : "Send OTP"}
              </button>
            </div>
            {otpErrors.otp && (
              <p className="text-red-500 text-sm mt-1">{otpErrors.otp.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !otpSent}
            className="w-full py-3.5 px-4 rounded-xl text-white font-medium shadow-md transform transition hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 bg-amber-500 hover:bg-amber-600"
          >
            {isSubmitting ? "Logging in..." : `Verify & Log In`}
          </button>
        </form>
      )}
    </div>
  );
};
