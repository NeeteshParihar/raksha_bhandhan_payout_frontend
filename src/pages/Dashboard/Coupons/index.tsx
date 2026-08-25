import  { useState, useEffect } from 'react';
import type { SisterAccount } from '../Accounts/SisterList';
import PickSister from '../../../components/Quizzes/PickSister';
import CouponList from '../../../components/Coupons/CouponList';
import CreateCoupon from '../../../components/Coupons/CreateCoupon';
import { getCouponsOfSister, deleteCoupon, type ICoupon } from '../../../services/coupon';
import { AlertCircle } from 'lucide-react';

const Coupons = () => {

  const [selectedSister, setSelectedSister] = useState<SisterAccount | null>(null);
  
  const [couponsList, setCouponsList] = useState<ICoupon[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const selectSister = (sister: SisterAccount) => {
    setSelectedSister(sister);
    localStorage.setItem('COUPON-selectedSisterId', sister._id);
  };

  const unselectSister = () => {
    setSelectedSister(null);
    setCouponsList([]);
    localStorage.removeItem('COUPON-selectedSisterId');
  };

  const fetchCoupons = async () => {
    if (selectedSister?._id) {
      setLoading(true);
      setError('');
      try {
        const response = await getCouponsOfSister(selectedSister._id);
        if (response.success && response.data) {
          setCouponsList(response.data);
        } else {
          setCouponsList([]);
        }
      } catch (err: any) {
        console.error('Failed to fetch coupons:', err);
        setError('Failed to fetch coupons.');
        setCouponsList([]);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, [selectedSister?._id]);

  const handleDeleteCoupon = async (couponId: string) => {
    try {
      const res = await deleteCoupon(couponId);
      if (res.success) {
        setCouponsList(couponsList.filter(c => c._id !== couponId));
      } else {
        alert(res.message || 'Failed to delete coupon');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred while deleting the coupon.');
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-10">
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-amber-500 tracking-tight">COUPONS</h1>
        <p className="text-gray-500 mt-2 font-medium">Generate and manage bonus cash coupons for your sisters.</p>
      </div>

      <PickSister 
        selectedSister={selectedSister} 
        selectSister={selectSister} 
        unselectSister={unselectSister} 
        localStoragePrefix='COUPON'
      />

      {error && (
        <div className="mt-8 p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl flex items-center gap-3">
          <AlertCircle size={20} />
          <span className="font-bold">{error}</span>
        </div>
      )}

      {selectedSister && (
        <div className="mt-12 space-y-12">
          
          <CreateCoupon sisterId={selectedSister._id} onSuccess={fetchCoupons} />
          
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Coupons for {selectedSister.name}</h2>
            </div>
            
            <CouponList 
              coupons={couponsList} 
              loading={loading}
              onDeleteCoupon={handleDeleteCoupon}
            />
          </div>

        </div>
      )}
    </div>
  );
};

export default Coupons;
