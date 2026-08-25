import React, { useState } from 'react';
import { Trash2, Gift, Clock, Loader2 } from 'lucide-react';
import type { ICoupon } from '../../services/coupon';
import dayjs from 'dayjs';

interface CouponCardProps {
  coupon: ICoupon;
  onDelete: (couponId: string) => Promise<void>;
}

const CouponCard: React.FC<CouponCardProps> = ({ coupon, onDelete }) => {
  
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete coupon ${coupon.couponCode}?`)) {
      setIsDeleting(true);
      try {
        await onDelete(coupon._id);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const isExpired = coupon.expiry ? dayjs().isAfter(dayjs(coupon.expiry)) : false;
  const isActive = coupon.status === 'UNUSED' && !isExpired;

  return (
    <div className={`relative p-5 rounded-2xl shadow-sm border transition-all ${
      isActive ? 'bg-gradient-to-br from-rose-50 to-amber-50 border-rose-100 hover:shadow-md' : 'bg-gray-50 border-gray-200 opacity-80'
    }`}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-xl ${isActive ? 'bg-rose-100 text-rose-600' : 'bg-gray-200 text-gray-500'}`}>
            <Gift size={20} />
          </div>
          <div>
            <h3 className="font-extrabold text-gray-800 tracking-wider font-mono text-lg">{coupon.couponCode}</h3>
          </div>
        </div>
        <button 
          onClick={handleDelete}
          disabled={isDeleting}
          className="p-2 text-gray-400 hover:text-rose-600 hover:bg-white rounded-full transition-colors disabled:opacity-50"
          title="Delete Coupon"
        >
          {isDeleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
        </button>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-500 font-bold uppercase tracking-wider mb-1">Value</p>
        <p className="text-4xl font-black text-gray-900">₹{coupon.amount}</p>
      </div>

      <div className="flex justify-between items-end border-t border-black/5 pt-4">
        <div>
          <span className={`inline-flex px-3 py-1 text-xs font-bold rounded-full ${
            coupon.status === 'APPLIED' ? 'bg-green-100 text-green-700' :
            isExpired ? 'bg-rose-100 text-rose-700' :
            'bg-amber-100 text-amber-700'
          }`}>
            {coupon.status === 'APPLIED' ? 'APPLIED' : isExpired ? 'EXPIRED' : 'ACTIVE'}
          </span>
        </div>
        
        {coupon.expiry && (
          <div className="text-right">
            <p className="text-xs text-gray-500 font-bold flex items-center justify-end gap-1 uppercase tracking-wider mb-1">
              <Clock size={12} /> Expiry
            </p>
            <p className={`text-sm font-semibold ${isExpired ? 'text-rose-600' : 'text-gray-700'}`}>
              {dayjs(coupon.expiry).format('DD MMM YYYY')}
            </p>
          </div>
        )}
      </div>
      
      {/* Decorative cutouts */}
      <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-8 bg-white rounded-r-full border-y border-r border-gray-100/50 mix-blend-overlay"></div>
      <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-8 bg-white rounded-l-full border-y border-l border-gray-100/50 mix-blend-overlay"></div>
    </div>
  );
};

export default CouponCard;
