import React, { useState } from 'react';
import { requestPayout, type IPayout } from '../../../../services/payout';

interface UpiFormProps {
  quizId: string | undefined;
  appliedCouponCode?: string;
  totalAmount: number;
  quizEarnedAmount: number;
  couponAmount: number;
  setPayout: (payout: IPayout) => void;
}

const UpiForm: React.FC<UpiFormProps> = ({ 
  quizId, 
  appliedCouponCode, 
  totalAmount, 
  quizEarnedAmount, 
  couponAmount, 
  setPayout 
}) => {
  const [upiId, setUpiId] = useState('');
  const [isRequestingPayout, setIsRequestingPayout] = useState(false);

  const handleRequestPayout = async () => {
    if (!quizId || !upiId.trim()) return;
    try {
      setIsRequestingPayout(true);
      const res = await requestPayout(quizId, { couponCode: appliedCouponCode, upiId: upiId.trim() });
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

  return (
    <div className="mt-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="w-full md:w-1/2">
          <h2 className="text-lg font-medium text-indigo-100 mb-1">Total Payout Amount</h2>
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-4xl font-bold">₹{totalAmount}</span>
            {couponAmount > 0 && (
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
  );
};

export default UpiForm;
