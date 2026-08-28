import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { getPayoutByQuiz, requestPayout,type IPayout, PayoutStatus } from '../../services/payout';
import { getCouponByCode, type ICoupon } from '../../services/coupon';
import { getQuizById, getQuizAttempts,type IQuizDetails, type IQuizAttempts } from '../../services/quiz';

const Payout: React.FC = () => {
  
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [payout, setPayout] = useState<IPayout | null>(null);
  const [quizDetails, setQuizDetails] = useState<IQuizDetails | null>(null);
  const [attempts, setAttempts] = useState<IQuizAttempts | null>(null);

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<ICoupon | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [isRequestingPayout, setIsRequestingPayout] = useState(false);
  const [upiId, setUpiId] = useState('');

  useEffect(() => {
    if (!quizId) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch Quiz & Attempts concurrently
        const [quizRes, attemptsRes] = await Promise.all([
          getQuizById(quizId).catch(() => null),
          getQuizAttempts(quizId).catch(() => null)
        ]);

        if (quizRes?.success && quizRes.data) {
          setQuizDetails(quizRes.data);
        }
        if (attemptsRes?.success && attemptsRes.data) {
          setAttempts(attemptsRes.data);
        }

        // Fetch Payout
        try {
          const successPayoutRes = await getPayoutByQuiz(quizId, PayoutStatus.SUCCESS);
          if (successPayoutRes.success && successPayoutRes.data) {
            setPayout(successPayoutRes.data);
            return;
          }
        } catch {
          // Ignore, continue to pending
        }

        try {
          const pendingPayoutRes = await getPayoutByQuiz(quizId, PayoutStatus.PENDING);
          if (pendingPayoutRes.success && pendingPayoutRes.data) {
            setPayout(pendingPayoutRes.data);
          }
        } catch {
          // Ignore, no payout found
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to load data';
        setError(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [quizId]);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    try {
      setIsApplyingCoupon(true);
      setCouponError(null);
      const res = await getCouponByCode(couponCode);
      if (res.success && res.data) {
        setAppliedCoupon(res.data);
      } else {
        setCouponError(res.message || 'Invalid coupon code');
      }
    } catch (err) {
      const errorMsg = err instanceof Error && 'response' in err 
        ? (err as { response?: { data?: { message?: string } } }).response?.data?.message 
        : 'Failed to apply coupon';
      setCouponError(errorMsg || 'Failed to apply coupon');
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError(null);
  };

  const handleRequestPayout = async () => {
    if (!quizId || !upiId.trim()) return;
    try {
      setIsRequestingPayout(true);
      const res = await requestPayout(quizId, { couponCode: appliedCoupon?.couponCode, upiId: upiId.trim() });
      if (res.success && res.data) {
        setPayout(res.data);
      }
    } catch (err) {
      const errorMsg = err instanceof Error && 'response' in err 
        ? (err as { response?: { data?: { message?: string } } }).response?.data?.message 
        : 'Failed to request payout';
      alert(errorMsg || 'Failed to request payout');
    } finally {
      setIsRequestingPayout(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-4xl mx-auto mt-10 bg-red-50 text-red-600 rounded-lg shadow-sm border border-red-100">
        <h2 className="text-lg font-semibold mb-2">Error Loading Payout</h2>
        <p>{error}</p>
        <button onClick={() => navigate(-1)} className="mt-4 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded transition-colors">Go Back</button>
      </div>
    );
  }

  const quizEarnedAmount = attempts?.totalAmountEarned || 0;
  const couponAmount = appliedCoupon ? appliedCoupon.amount : 0;
  const totalAmount = quizEarnedAmount + couponAmount;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-indigo-50/50 px-6 py-4 border-b border-gray-100">
          <h1 className="text-2xl font-bold text-gray-800">Payout Details</h1>
          {quizDetails && (
            <p className="text-gray-500 mt-1">Quiz: {quizDetails.title}</p>
          )}
        </div>

        <div className="p-6">
          <div className="grid gap-6 md:grid-cols-2">
            
            {/* Quiz Info */}
            <div className="bg-gray-50 rounded-lg p-5 border border-gray-100">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Quiz Earnings</h3>
              <div className="flex justify-between items-center mb-3 pb-3 border-b border-gray-200">
                <span className="text-gray-600">Quiz Completed</span>
                <span className="font-medium text-gray-900">₹{quizEarnedAmount}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Questions Answered</span>
                <span className="text-gray-700 font-medium">{attempts?.questions?.length || 0}</span>
              </div>
            </div>

            {/* Payout State or Action */}
            <div className="bg-gray-50 rounded-lg p-5 border border-gray-100 flex flex-col justify-center">
              {payout ? (
                <div className="text-center">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
                    payout.status === PayoutStatus.SUCCESS ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                  }`}>
                    {payout.status === PayoutStatus.SUCCESS ? (
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    ) : (
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-1">
                    {payout.status === PayoutStatus.SUCCESS ? 'Payout Successful' : 'Payout Pending'}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">Total Amount: <span className="font-semibold text-gray-700">₹{payout.totalAmount}</span></p>
                  <p className="text-xs text-gray-400 mb-4">Requested on: {new Date(payout.createdAt).toLocaleDateString()}</p>

                  {/* WhatsApp Reminder Button — only shown for PENDING payouts */}
                  {payout.status === PayoutStatus.PENDING && payout.brother && payout.sister && (() => {
                    const sisterName = payout.sister!.name;
                    const brotherPhone = `${payout.brother!.countryCode.replace('+', '')}${payout.brother!.phoneNumber}`;
                    const upiLink = `upi://pay?pa=${encodeURIComponent(payout.upiId || '')}&pn=${encodeURIComponent(sisterName)}&am=${payout.totalAmount}&cu=INR&tn=${encodeURIComponent(`Rakhi gift from ${sisterName}`)}`;
                    const serverLink = `${import.meta.env.VITE_API_URL}/api/payouts/pay?pa=${upiId}&pn=${sisterName}&am=${totalAmount}`
                    const confirmLink = `${window.location.origin}/payout/${payout._id}/confirm`;
                    const message = `🎀 Happy Raksha Bandhan, bhaiya! 💛\n\nI'm ${sisterName} and I've completed my rakhi quiz! My payout of ₹${payout.totalAmount} is still pending. 🙏\n\nPlease send the Rakhi money via UPI:\n${upiLink}\n\nUPI ID: ${payout.upiId || 'N/A'}\nAmount: ₹${payout.totalAmount}\n\n or Pay using this link ${serverLink} \n\n Once you've paid, please tap the link below to confirm the payment ✅\n${confirmLink}\n\nLove you bhaiya! 🌸`;
                    const whatsappUrl = `https://wa.me/${brotherPhone}?text=${encodeURIComponent(message)}`;

                    return (
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-semibold py-2.5 px-5 rounded-lg shadow-md transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 text-sm"
                      >
                        {/* WhatsApp icon */}
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                        </svg>
                        Request Rakhi Money on WhatsApp
                      </a>
                    );
                  })()}
                </div>
              ) : (
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Apply Coupon</h3>
                  {!appliedCoupon ? (
                    <form onSubmit={handleApplyCoupon} className="space-y-3">
                      <div>
                        <input
                          type="text"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          placeholder="Enter coupon code"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow"
                          disabled={isApplyingCoupon}
                        />
                      </div>
                      {couponError && <p className="text-red-500 text-xs">{couponError}</p>}
                      <button
                        type="submit"
                        disabled={isApplyingCoupon || !couponCode.trim()}
                        className="w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
                      >
                        {isApplyingCoupon ? 'Checking...' : 'Apply Coupon'}
                      </button>
                    </form>
                  ) : (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="text-green-800 font-medium text-sm">Coupon Applied!</p>
                          <p className="text-green-600 text-xs">{appliedCoupon.couponCode}</p>
                        </div>
                        <button onClick={handleRemoveCoupon} className="text-red-500 hover:text-red-700 text-sm font-medium transition-colors">
                          Remove
                        </button>
                      </div>
                      <p className="text-green-700 font-bold">₹{appliedCoupon.amount} <span className="text-green-600 font-normal text-sm">added to total</span></p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Final amount & Request Button */}
          {!payout && (
            <div className="mt-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
              <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="w-full md:w-1/2">
                  <h2 className="text-lg font-medium text-indigo-100 mb-1">Total Payout Amount</h2>
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-4xl font-bold">₹{totalAmount}</span>
                    {appliedCoupon && (
                      <span className="text-indigo-200 text-sm">(₹{quizEarnedAmount} + ₹{couponAmount})</span>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="upiId" className="text-sm font-medium text-indigo-100 mb-1">Your UPI ID</label>
                    <input
                      id="upiId"
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="e.g. 9876543210@upi"
                      className="px-4 py-2 bg-white/10 border border-indigo-300/30 rounded-lg text-white placeholder-indigo-200 focus:outline-none focus:ring-2 focus:ring-white/50 w-full"
                      disabled={isRequestingPayout}
                    />
                  </div>
                </div>
                <div className="w-full md:w-auto flex justify-end">
                  <button
                    onClick={handleRequestPayout}
                    disabled={isRequestingPayout || totalAmount <= 0 || !upiId.trim()}
                    className="bg-white text-indigo-600 hover:bg-indigo-50 font-bold py-3 px-8 rounded-lg shadow-md transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:hover:translate-y-0"
                  >
                    {isRequestingPayout ? 'Processing...' : 'Request Rakhi Money'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Payout;
