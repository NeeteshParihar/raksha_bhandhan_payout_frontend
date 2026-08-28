import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useSelector } from 'react-redux';
import type { RootState } from '../../features/store';
import { getPayoutById, updatePayoutStatus, PayoutStatus, type IPayout } from '../../services/payout';
import { BrotherLoginModal } from '../../components/Auth/BrotherLoginModal';
import { CheckCircle2, Clock, ShieldCheck, AlertCircle } from 'lucide-react';

const ConfirmPayout = () => {
  const { payoutId } = useParams<{ payoutId: string }>();
  const userProfile = useSelector((state: RootState) => state.userProfile.profile);

  const [payout, setPayout] = useState<IPayout | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [confirming, setConfirming] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const isLoggedIn = !!userProfile;

  const fetchPayout = async () => {
    if (!payoutId) return;
    try {
      setLoading(true);
      setError('');
      const res = await getPayoutById(payoutId);
      if (res.success && res.data) {
        setPayout(res.data);
      } else {
        setError('Payout not found.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load payout details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) fetchPayout();
    else setLoading(false);
  }, [payoutId, isLoggedIn]);

  const handleLoginSuccess = () => {
    setLoading(true);
    fetchPayout();
  };

  const handleConfirmPayment = async () => {
    if (!payoutId || !agreed) return;
    try {
      setConfirming(true);
      setError('');
      const res = await updatePayoutStatus(payoutId, PayoutStatus.SUCCESS);
      if (res.success && res.data) {
        setPayout(res.data);
        setConfirmed(true);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update payout. Please try again.');
    } finally {
      setConfirming(false);
    }
  };

  const sisterName = payout?.sister?.name || 'your sister';
  const isAlreadyPaid = payout?.status === PayoutStatus.SUCCESS;

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-amber-50 flex items-center justify-center p-4 font-sans relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-0 right-0 -mr-32 -mt-32 w-[500px] h-[500px] rounded-full bg-rose-200 opacity-30 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-32 -mb-32 w-[450px] h-[450px] rounded-full bg-amber-200 opacity-30 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-pink-100 opacity-20 blur-3xl pointer-events-none" />

      {/* Login portal — shown when not logged in */}
      {!isLoggedIn && <BrotherLoginModal onSuccess={handleLoginSuccess} />}

      <div className="relative z-10 w-full max-w-lg">
        {/* Brand */}
        <div className="text-center mb-8">
          <span className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-amber-500">
            🪔 RakhiPay
          </span>
        </div>

        <div className="bg-white/80 backdrop-blur-xl border border-white/60 rounded-3xl shadow-2xl overflow-hidden">
          {/* Header strip */}
          <div className="bg-gradient-to-r from-rose-500 to-amber-500 px-8 py-6 text-white text-center">
            <h1 className="text-2xl font-extrabold tracking-tight">Confirm Rakhi Payment</h1>
            <p className="text-rose-100 text-sm mt-1">Mark payment as received by your sister</p>
          </div>

          <div className="p-8">
            {/* Loading */}
            {loading && (
              <div className="flex flex-col items-center justify-center py-12 gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500" />
                <p className="text-gray-500 text-sm">Loading payout details...</p>
              </div>
            )}

            {/* Error state */}
            {!loading && error && (
              <div className="flex flex-col items-center gap-3 py-10 text-center">
                <AlertCircle className="text-red-400" size={48} />
                <p className="text-red-600 font-medium">{error}</p>
                <button
                  onClick={fetchPayout}
                  className="mt-2 px-5 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 font-semibold rounded-xl transition-colors text-sm"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Already SUCCESS */}
            {!loading && !error && (isAlreadyPaid || confirmed) && (
              <div className="flex flex-col items-center text-center py-8 gap-5">
                <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center animate-pulse">
                  <CheckCircle2 className="text-green-500" size={52} />
                </div>
                <div>
                  <h2 className="text-2xl font-extrabold text-gray-800">Payment Confirmed! 🎉</h2>
                  <p className="text-gray-500 mt-2 text-base">
                    You have successfully confirmed Rakhi payment of{' '}
                    <span className="font-bold text-gray-800">₹{payout?.totalAmount}</span> to{' '}
                    <span className="font-bold text-rose-600">{sisterName}</span>.
                  </p>
                </div>
                <div className="w-full bg-green-50 border border-green-200 rounded-2xl p-5 text-left space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Sister</span>
                    <span className="font-semibold text-gray-800">{sisterName}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Amount</span>
                    <span className="font-semibold text-gray-800">₹{payout?.totalAmount}</span>
                  </div>
                  {payout?.upiId && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">UPI ID</span>
                      <span className="font-semibold text-gray-800 font-mono">{payout.upiId}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Status</span>
                    <span className="font-semibold text-green-600">✓ Paid</span>
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Happy Raksha Bandhan! 🌸 Thank you for being a wonderful brother.
                </p>
              </div>
            )}

            {/* PENDING — confirm UI */}
            {!loading && !error && payout && !isAlreadyPaid && !confirmed && (
              <div className="space-y-6">
                {/* Payout info card */}
                <div className="bg-gradient-to-br from-rose-50 to-amber-50 border border-rose-100 rounded-2xl p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                      <Clock className="text-yellow-600" size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-gray-800">Payout Pending</p>
                      <p className="text-xs text-gray-500">
                        Requested on {new Date(payout.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Sister</span>
                      <span className="font-semibold text-gray-800">{sisterName}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Total Amount</span>
                      <span className="font-bold text-rose-600 text-lg">₹{payout.totalAmount}</span>
                    </div>
                    {payout.upiId && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">UPI ID</span>
                        <span className="font-semibold text-gray-800 font-mono">{payout.upiId}</span>
                      </div>
                    )}
                    {payout.quizAmount > 0 && (
                      <div className="flex justify-between text-sm text-gray-400">
                        <span>Quiz Earnings</span>
                        <span>₹{payout.quizAmount}</span>
                      </div>
                    )}
                    {payout.couponAmount > 0 && (
                      <div className="flex justify-between text-sm text-gray-400">
                        <span>Coupon Bonus</span>
                        <span>+₹{payout.couponAmount}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Agreement checkbox */}
                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="relative mt-0.5 flex-shrink-0">
                    <input
                      id="agreement-checkbox"
                      type="checkbox"
                      checked={agreed}
                      onChange={(e) => setAgreed(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${agreed ? 'bg-rose-500 border-rose-500' : 'border-gray-300 group-hover:border-rose-400'}`}>
                      {agreed && (
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <span className="text-sm text-gray-600 leading-snug">
                    I confirm that I have already paid{' '}
                    <span className="font-bold text-rose-600">₹{payout.totalAmount}</span> as Rakhi money to{' '}
                    <span className="font-bold text-gray-800">{sisterName}</span>. By clicking the button below, I agree to mark this payout as complete.
                  </span>
                </label>

                {error && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">{error}</div>
                )}

                {/* Confirm button */}
                <button
                  onClick={handleConfirmPayment}
                  disabled={!agreed || confirming}
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-bold text-base shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:hover:translate-y-0 disabled:cursor-not-allowed"
                >
                  {confirming ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                      Confirming...
                    </>
                  ) : (
                    <>
                      <ShieldCheck size={20} />
                      Mark as Paid ✓
                    </>
                  )}
                </button>

                <p className="text-xs text-gray-400 text-center">
                  This action is irreversible. Once marked as paid, the payout status will be updated to <strong>SUCCESS</strong>.
                </p>
              </div>
            )}
          </div>
        </div>

        <p className="text-center text-gray-400 text-xs mt-6">🌸 Happy Raksha Bandhan from RakhiPay</p>
      </div>
    </div>
  );
};

export default ConfirmPayout;
