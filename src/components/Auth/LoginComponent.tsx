import { useState, useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { loginUser, getOtp, loginByOtp } from "../../services/user";
import { login } from "../../features/userProfileSlice";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { PhoneNumber } from "../ui/PhoneNumber";

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

export const LoginComponent = () => {
  
  const [role, setRole] = useState<"BROTHER" | "SISTER">("BROTHER");
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
  const navigate = useNavigate();

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

  const handleRoleChange = (newRole: "BROTHER" | "SISTER") => {
    setRole(newRole);
    setError("");
    resetPassword();
    resetOtp();
    setOtpSent(false);
    setResendTimer(0);
  };

  const handleMethodChange = (newMethod: "PASSWORD" | "OTP") => {
    setLoginMethod(newMethod);
    setError("");
    resetPassword();
    // resetOtp();
    // setOtpSent(false);
    // setResendTimer(0);
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
      navigate(role === 'SISTER' ? '/sisterDashboard' : '/dashboard');
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
      navigate(role === 'SISTER' ? '/sisterDashboard' : '/dashboard');
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
        <h2 className="text-2xl font-bold text-gray-800">Welcome Back</h2>
        <p className="text-gray-500 mt-2">Log in to continue celebrating.</p>
      </div>

      {/* Role Toggle */}
      <div className="flex bg-white/50 p-1 rounded-xl mb-4 border border-rose-100 shadow-inner">
        <button
          onClick={() => handleRoleChange("BROTHER")}
          className={`flex-1 py-2 rounded-lg font-medium transition-all ${
            role === "BROTHER"
              ? "bg-rose-500 text-white shadow-md"
              : "text-gray-500 hover:text-rose-600"
          }`}
        >
          I am a Brother
        </button>
        <button
          onClick={() => handleRoleChange("SISTER")}
          className={`flex-1 py-2 rounded-lg font-medium transition-all ${
            role === "SISTER"
              ? "bg-amber-500 text-white shadow-md"
              : "text-gray-500 hover:text-amber-600"
          }`}
        >
          I am a Sister
        </button>
      </div>

      {/* Method Toggle */}
      <div className="flex justify-center mb-6 space-x-4">
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="radio"
            checked={loginMethod === "PASSWORD"}
            onChange={() => handleMethodChange("PASSWORD")}
            className="text-rose-500 focus:ring-rose-400 h-4 w-4"
          />
          <span className="text-sm font-medium text-gray-700">Password</span>
        </label>
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="radio"
            checked={loginMethod === "OTP"}
            onChange={() => handleMethodChange("OTP")}
            className="text-rose-500 focus:ring-rose-400 h-4 w-4"
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
          <PhoneNumber
            label="Phone Number"
            placeholder="9876543210"
            prefix="+91"
            error={passwordErrors.phoneNumber?.message}
            {...registerPassword("phoneNumber")}
          />

          {/* Password Field */}
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            error={passwordErrors.password?.message}
            {...registerPassword("password")}
          />

          <Button
            type="submit"
            isLoading={isSubmitting}
            variant={role === "BROTHER" ? "danger" : "primary"}
            className={role === "SISTER" ? "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700" : ""}
          >
            {`Log In as ${role === "BROTHER" ? "Brother" : "Sister"}`}
          </Button>
        </form>
      ) : (
        <form onSubmit={handleOtpSubmit(onOtpSubmit)} className="space-y-5">
          {/* Phone Number Field */}
          <PhoneNumber
            label="Phone Number"
            placeholder="9876543210"
            prefix="+91"
            error={otpErrors.phoneNumber?.message}
            {...registerOtp("phoneNumber")}
          />

          {/* OTP Field */}
          <Input
            label="OTP (One Time Password)"
            type="text"
            placeholder="123456"
            maxLength={6}
            error={otpErrors.otp?.message}
            {...registerOtp("otp")}
            suffix={
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={isSubmitting || resendTimer > 0}
                className="px-4 py-3 border-l border-amber-200 text-amber-600 font-medium bg-amber-50 hover:bg-amber-100 transition-colors whitespace-nowrap disabled:opacity-50 h-full rounded-r-xl"
              >
                {resendTimer > 0 ? `Resend in ${formatTime(resendTimer)}` : "Send OTP"}
              </button>
            }
          />

          <Button
            type="submit"
            isLoading={isSubmitting}
            disabled={!otpSent}
            variant={role === "BROTHER" ? "danger" : "primary"}
            className={role === "SISTER" ? "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700" : ""}
          >
            Verify & Log In
          </Button>
        </form>
      )}
    </div>
  );
};
