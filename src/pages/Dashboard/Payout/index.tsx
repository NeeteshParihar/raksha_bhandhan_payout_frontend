import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { usePayoutData } from './hooks/usePayoutData';
import type { ICoupon } from '../../../services/coupon';

import PayoutSummary from './components/PayoutSummary';
import PayoutStatusBanner from './components/PayoutStatusBanner';
import CouponForm from './components/CouponForm';
import UpiForm from './components/UpiForm';

const Payout: React.FC = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();

  const { loading, error, payout, setPayout, quizDetails, attempts } = usePayoutData(quizId);
  const [appliedCoupon, setAppliedCoupon] = useState<ICoupon | null>(null);

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
    <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-2">
        <button 
          onClick={() => navigate('/sisterDashboard/myquizzes')}
          className="p-2 hover:bg-gray-200 bg-gray-100 rounded-full text-gray-600 transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-800 tracking-tight">Payout</h1>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-indigo-50/50 px-6 py-4 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800">Payout Details</h2>
          {quizDetails && (
            <p className="text-gray-500 mt-1">Quiz: {quizDetails.title}</p>
          )}
        </div>

        <div className="p-6">
          <div className="grid gap-6 md:grid-cols-2">
            <PayoutSummary 
              attempts={attempts} 
              quizEarnedAmount={quizEarnedAmount} 
            />

            {payout ? (
              <PayoutStatusBanner payout={payout} />
            ) : (
              <div className="bg-gray-50 rounded-lg p-5 border border-gray-100 flex flex-col justify-center h-full">
                <CouponForm appliedCoupon={appliedCoupon} setAppliedCoupon={setAppliedCoupon} />
              </div>
            )}
          </div>

          {!payout && (
            <UpiForm 
              quizId={quizId}
              appliedCouponCode={appliedCoupon?.couponCode}
              totalAmount={totalAmount}
              quizEarnedAmount={quizEarnedAmount}
              couponAmount={couponAmount}
              setPayout={setPayout}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Payout;
