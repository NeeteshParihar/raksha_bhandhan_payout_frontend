import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch } from 'react-redux';
import { loginUser, getOtp, loginByOtp } from '../../services/user';
import { login } from '../../features/userProfileSlice';
import { PhoneNumber } from '../ui/PhoneNumber';

const passwordSchema = z.object({
  phoneNumber: z
    .string()
    .regex(/^[0-9]+$/, 'Please enter valid digits only')
    .min(10, 'Phone number must be at least 10 digits')
    .max(12, 'Phone number cannot exceed 12 digits'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const otpSchema = z.object({
  phoneNumber: z
    .string()
    .regex(/^[0-9]+$/, 'Please enter valid digits only')
    .min(10, 'Phone number must be at least 10 digits')
    .max(12, 'Phone number cannot exceed 12 digits'),
  otp: z.string().length(6, 'OTP must be exactly 6 digits'),
});

type PasswordInputs = z.infer<typeof passwordSchema>;
type OtpInputs = z.infer<typeof otpSchema>;

interface BrotherLoginModalProps {
  onSuccess: () => void;
}

export const BrotherLoginModal = ({ onSuccess }: BrotherLoginModalProps) => {
  const dispatch = useDispatch();

  const [loginMethod, setLoginMethod] = useState<'PASSWORD' | 'OTP'>('PASSWORD');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (resendTimer > 0) {
      interval = setInterval(() => setResendTimer((p) => p - 1), 1000);
    } else if (resendTimer === 0 && otpSent) {
      setOtpSent(false);
    }
    return () => clearInterval(interval);
  }, [resendTimer, otpSent]);

  const formatTime = (s: number) =>
    `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  const { register: regPwd, handleSubmit: handlePwdSubmit, formState: { errors: pwdErrors }, reset: resetPwd } =
    useForm<PasswordInputs>({ resolver: zodResolver(passwordSchema) });

  const { register: regOtp, handleSubmit: handleOtpSubmit, formState: { errors: otpErrors },
    reset: resetOtp, getValues: getOtpValues, trigger: triggerOtp } =
    useForm<OtpInputs>({ resolver: zodResolver(otpSchema) });

  const handleMethodChange = (m: 'PASSWORD' | 'OTP') => {
    setLoginMethod(m);
    setError('');
    resetPwd();
    resetOtp();
    setOtpSent(false);
    setResendTimer(0);
  };

  const onPasswordSubmit: SubmitHandler<PasswordInputs> = async (data) => {
    try {
      setIsSubmitting(true);
      setError('');
      const res = await loginUser({ phoneNumber: data.phoneNumber, password: data.password, role: 'BROTHER' });
      dispatch(login(res.data));
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendOtp = async () => {
    const valid = await triggerOtp('phoneNumber');
    if (!valid) return;
    try {
      setError('');
      setIsSubmitting(true);
      const phone = getOtpValues('phoneNumber');
      const res = await getOtp(phone);
      setOtpSent(true);
      setResendTimer((res?.minutes || 5) * 60);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to send OTP.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const onOtpSubmit: SubmitHandler<OtpInputs> = async (data) => {
    try {
      setIsSubmitting(true);
      setError('');
      const res = await loginByOtp({ phoneNumber: data.phoneNumber, otp: data.otp, role: 'BROTHER' });
      dispatch(login(res.data));
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'OTP login failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const modal = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-rose-300 opacity-25 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-amber-200 opacity-25 blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-md bg-white/85 backdrop-blur-xl border border-white/60 rounded-3xl shadow-2xl p-8">
        <div className="text-center mb-6">
          <div className="text-4xl mb-3">🪔</div>
          <h2 className="text-2xl font-bold text-gray-800">Brother Login Required</h2>
          <p className="text-gray-500 text-sm mt-2">Sign in as a brother to confirm your Rakhi payment</p>
        </div>

        <div className="flex justify-center gap-6 mb-6">
          {(['PASSWORD', 'OTP'] as const).map((m) => (
            <label key={m} className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="radio"
                checked={loginMethod === m}
                onChange={() => handleMethodChange(m)}
                className="text-rose-500 focus:ring-rose-400 h-4 w-4 accent-rose-500"
              />
              <span className="text-sm font-medium text-gray-700">{m === 'PASSWORD' ? 'Password' : 'OTP'}</span>
            </label>
          ))}
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">{error}</div>
        )}

        {loginMethod === 'PASSWORD' ? (
          <form onSubmit={handlePwdSubmit(onPasswordSubmit)} className="space-y-4">
            <div>
              <PhoneNumber
                label="Phone Number"
                placeholder="9876543210"
                prefix="+91"
                error={pwdErrors.phoneNumber?.message}
                {...regPwd('phoneNumber')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password" placeholder="••••••••"
                className={`w-full px-4 py-3 rounded-xl border text-sm bg-white/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-400 transition-colors ${pwdErrors.password ? 'border-red-400' : 'border-gray-200'}`}
                {...regPwd('password')}
              />
              {pwdErrors.password && <p className="text-red-500 text-xs mt-1">{pwdErrors.password.message}</p>}
            </div>

            <button
              type="submit" disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-semibold shadow-md transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70"
            >
              {isSubmitting ? 'Logging in...' : 'Log In as Brother'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleOtpSubmit(onOtpSubmit)} className="space-y-4">
            <div>
              <PhoneNumber
                label="Phone Number"
                placeholder="9876543210"
                prefix="+91"
                error={otpErrors.phoneNumber?.message}
                {...regOtp('phoneNumber')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">OTP</label>
              <div className="flex gap-2">
                <input
                  type="text" placeholder="123456" maxLength={6}
                  className={`flex-1 px-4 py-3 rounded-xl border text-sm bg-white/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-400 transition-colors ${otpErrors.otp ? 'border-red-400' : 'border-gray-200'}`}
                  {...regOtp('otp')}
                />
                <button
                  type="button" onClick={handleSendOtp} disabled={isSubmitting || resendTimer > 0}
                  className="px-4 py-3 rounded-xl border border-rose-200 text-rose-600 font-medium bg-rose-50 hover:bg-rose-100 transition-colors whitespace-nowrap disabled:opacity-50 text-sm"
                >
                  {resendTimer > 0 ? `Resend ${formatTime(resendTimer)}` : 'Send OTP'}
                </button>
              </div>
              {otpErrors.otp && <p className="text-red-500 text-xs mt-1">{otpErrors.otp.message}</p>}
            </div>

            <button
              type="submit" disabled={isSubmitting || !otpSent}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-semibold shadow-md transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70"
            >
              {isSubmitting ? 'Verifying...' : 'Verify & Log In'}
            </button>
          </form>
        )}
      </div>
    </div>
  );

  return createPortal(modal, document.body);
};
