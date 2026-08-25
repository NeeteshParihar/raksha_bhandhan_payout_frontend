import React from 'react';
import type { ICoupon } from '../../services/coupon';
import CouponCard from './CouponCard';

interface CouponListProps {
  coupons: ICoupon[];
  loading: boolean;
  onDeleteCoupon: (couponId: string) => Promise<void>;
}

const CouponList: React.FC<CouponListProps> = ({ coupons, loading, onDeleteCoupon }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (coupons.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-300">
        <h3 className="text-lg font-bold text-gray-700 mb-1">No Coupons Yet</h3>
        <p className="text-gray-500">Create a coupon above to send bonus money to your sister.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {coupons.map(coupon => (
        <CouponCard 
          key={coupon._id} 
          coupon={coupon} 
          onDelete={onDeleteCoupon} 
        />
      ))}
    </div>
  );
};

export default CouponList;
