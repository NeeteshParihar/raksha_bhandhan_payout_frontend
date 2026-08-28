import React, { useState } from 'react';
import { getCouponByCode, type ICoupon } from '../../../../services/coupon';

interface CouponFormProps {
  appliedCoupon: ICoupon | null;
  setAppliedCoupon: (coupon: ICoupon | null) => void;
}

const CouponForm: React.FC<CouponFormProps> = ({ appliedCoupon, setAppliedCoupon }) => {
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState<string | null>(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

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

  return (
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
  );
};

export default CouponForm;
