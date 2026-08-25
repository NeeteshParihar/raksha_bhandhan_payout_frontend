import React, { useState } from 'react';
import { Plus, Gift, AlertCircle } from 'lucide-react';
import { createCoupon } from '../../services/coupon';

interface CreateCouponProps {
  sisterId: string;
  onSuccess: () => void;
}

const CreateCoupon: React.FC<CreateCouponProps> = ({ sisterId, onSuccess }) => {
  
  const [amount, setAmount] = useState<number | ''>('');
  const [expiry, setExpiry] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || amount <= 0) {
      return setError('Please enter a valid amount.');
    }
    setError('');
    setIsSubmitting(true);

    try {
      const response = await createCoupon(
        sisterId,
        Number(amount),
        expiry ? new Date(expiry) : undefined
      );

      if (response.success) {
        setAmount('');
        setExpiry('');
        onSuccess();
      } else {
        setError(response.message || 'Failed to create coupon.');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'An error occurred while creating the coupon.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mb-10 max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center p-3 bg-rose-50 text-rose-600 rounded-full mb-3">
          <Gift size={28} />
        </div>
        <h3 className="text-2xl font-bold text-gray-800">Generate Bonus Coupon</h3>
        <p className="text-gray-500 mt-1 font-medium">Reward your sister with extra cash!</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl flex items-center gap-3">
          <AlertCircle size={20} />
          <span className="font-bold">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Coupon Amount (₹)</label>
          <input
            type="number"
            min="1"
            required
            value={amount}
            onChange={(e) => setAmount(e.target.value === '' ? '' : Number(e.target.value))}
            placeholder="e.g. 500"
            className="w-full p-4 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-400 font-bold text-gray-800 transition-colors text-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider flex justify-between">
            <span>Expiry Date (Optional)</span>
            <span className="text-gray-400 font-normal normal-case">Never expires if left blank</span>
          </label>
          <input
            type="date"
            value={expiry}
            onChange={(e) => setExpiry(e.target.value)}
            min={new Date().toISOString().split('T')[0]} // Cannot set past dates
            className="w-full p-4 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-400 font-medium text-gray-700 transition-colors"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 bg-gradient-to-r from-rose-500 to-amber-500 text-white font-extrabold rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-70 text-lg"
        >
          {isSubmitting ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            <Plus size={24} />
          )}
          {isSubmitting ? 'Generating...' : 'Generate Coupon'}
        </button>
      </form>
    </div>
  );
};

export default CreateCoupon;
