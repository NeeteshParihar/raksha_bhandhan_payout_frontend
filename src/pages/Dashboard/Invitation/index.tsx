import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { createPortal } from 'react-dom';
import { useSelector } from 'react-redux';
import { ArrowLeft, Gift, Brain, Send, CheckCircle2, MessageSquare } from 'lucide-react';
import type { RootState } from '../../../features/store';
import { getQuizzesOfSister, type IQuiz } from '../../../services/quiz';
import { getCouponsOfSister, type ICoupon } from '../../../services/coupon';
import { getSistersAccounts } from '../../../services/user';

const Invitation = () => {
  const { sisterId } = useParams<{ sisterId: string }>();
  const navigate = useNavigate();
  const sistersAccounts = useSelector((state: RootState) => state.sistersAccounts.accounts);
  
  const [sister, setSister] = useState<any>(null);
  const [quizzes, setQuizzes] = useState<IQuiz[]>([]);
  const [coupons, setCoupons] = useState<ICoupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [message, setMessage] = useState("Happy Raksha Bandhan! I've set up a fun quiz and a surprise gift for you. Play it now!");
  const [selectedQuizId, setSelectedQuizId] = useState<string>('');
  const [selectedCouponId, setSelectedCouponId] = useState<string>('');
  
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!sisterId) return;
      setLoading(true);
      setError('');
      try {
        // Find sister
        let currentSister = sistersAccounts?.find(s => s._id === sisterId);
        if (!currentSister) {
          const res = await getSistersAccounts();
          if (res.success && res.data) {
            currentSister = res.data.find((s: any) => s._id === sisterId);
          }
        }
        
        if (!currentSister) {
          setError('Sister not found');
          setLoading(false);
          return;
        }
        setSister(currentSister);

        // Fetch Quizzes and Coupons in parallel
        const [quizzesRes, couponsRes] = await Promise.all([
          getQuizzesOfSister(sisterId),
          getCouponsOfSister(sisterId)
        ]);

        if (quizzesRes.success && quizzesRes.data) {
          if (quizzesRes.data.length === 0) {
            // No quizzes -> redirect to quizzes page to create one
            localStorage.setItem('QUIZ-selectedSisterId', sisterId);
            navigate('/dashboard/quizzes');
            return;
          }
          setQuizzes(quizzesRes.data);
          // Auto-select first quiz if none selected
          setSelectedQuizId(quizzesRes.data[0]._id);
        }

        if (couponsRes.success && couponsRes.data) {
          setCoupons(couponsRes.data);
        }

      } catch (err) {
        console.error('Failed to fetch invitation details:', err);
        setError('Failed to load details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [sisterId, sistersAccounts, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500"></div>
      </div>
    );
  }

  if (error || !sister) {
    return (
      <div className="text-center py-20">
        <p className="text-red-500 mb-4">{error || 'Something went wrong'}</p>
        <button onClick={() => navigate('/dashboard/accounts')} className="px-4 py-2 bg-rose-50 text-rose-600 rounded-lg">Go Back</button>
      </div>
    );
  }

  const getQuizLink = () => {
    return `${window.location.origin}/sisterDashboard/quiz/${selectedQuizId}`;
  };

  const generateFinalMessage = () => {
    const selectedCoupon = coupons.find(c => c._id === selectedCouponId);
    let finalMsg = `${message}`;
    if (selectedCoupon) {
      finalMsg += `\n\nCoupon Code: ${selectedCoupon.couponCode}`;
    }
    finalMsg += `\n\nPlay Quiz: ${getQuizLink()}`;
    return finalMsg;
  };

  const handleSendWhatsApp = () => {
    const text = encodeURIComponent(generateFinalMessage());
    const phone = sister.countryCode ? `${sister.countryCode.replace('+', '')}${sister.phoneNumber}` : `91${sister.phoneNumber}`;
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
  };

  return (
    <div className="max-w-4xl mx-auto pb-20 mt-10">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => navigate('/dashboard/accounts')}
          className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">Send Invitation</h1>
          <p className="text-gray-500 font-medium text-sm">Compose and send Rakhi invitation</p>
        </div>
      </div>

      <div className="space-y-8">
        {/* Sister Details */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500 font-medium mb-1 uppercase tracking-wider">Sending to</p>
            <p className="font-bold text-xl text-gray-800">{sister.name}</p>
            <p className="text-gray-600 font-medium">{sister.phoneNumber}</p>
          </div>
        </div>

        {/* Message Editor */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-4">
            <MessageSquare size={20} className="text-rose-500" />
            Invitation Message
          </h2>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full p-4 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-400 text-gray-700 min-h-[120px] transition-colors"
            placeholder="Write your custom message here..."
          />
        </div>

        {/* Quiz Selection */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-4">
            <Brain size={20} className="text-rose-500" />
            Select Quiz (Required)
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {quizzes.map(quiz => (
              <div 
                key={quiz._id}
                onClick={() => setSelectedQuizId(quiz._id)}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex justify-between items-center ${
                  selectedQuizId === quiz._id ? 'border-rose-500 bg-rose-50' : 'border-gray-100 hover:border-gray-300'
                }`}
              >
                <div>
                  <p className={`font-bold ${selectedQuizId === quiz._id ? 'text-rose-700' : 'text-gray-700'}`}>{quiz.title}</p>
                  <p className="text-xs text-gray-500 mt-1">Status: {quiz.status.replace('_', ' ')}</p>
                </div>
                {selectedQuizId === quiz._id && <CheckCircle2 className="text-rose-500" size={20} />}
              </div>
            ))}
          </div>
        </div>

        {/* Coupon Selection */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-4">
            <Gift size={20} className="text-amber-500" />
            Select Coupon (Optional)
          </h2>
          {coupons.length === 0 ? (
            <p className="text-gray-500 italic text-sm">No active coupons available. You can create one on the Coupons page.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div 
                onClick={() => setSelectedCouponId('')}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex justify-between items-center ${
                  !selectedCouponId ? 'border-amber-500 bg-amber-50' : 'border-gray-100 hover:border-gray-300'
                }`}
              >
                <p className={`font-bold ${!selectedCouponId ? 'text-amber-700' : 'text-gray-700'}`}>No Coupon</p>
                {!selectedCouponId && <CheckCircle2 className="text-amber-500" size={20} />}
              </div>

              {coupons.filter(c => c.status === 'UNUSED').map(coupon => (
                <div 
                  key={coupon._id}
                  onClick={() => setSelectedCouponId(coupon._id)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex justify-between items-center ${
                    selectedCouponId === coupon._id ? 'border-amber-500 bg-amber-50' : 'border-gray-100 hover:border-gray-300'
                  }`}
                >
                  <div>
                    <p className={`font-bold ${selectedCouponId === coupon._id ? 'text-amber-700' : 'text-gray-700'}`}>₹{coupon.amount}</p>
                    <p className="text-xs font-mono text-gray-500 mt-1">{coupon.couponCode}</p>
                  </div>
                  {selectedCouponId === coupon._id && <CheckCircle2 className="text-amber-500" size={20} />}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Preview Button */}
        <div className="flex justify-end pt-4">
          <button 
            onClick={() => setShowPreview(true)}
            disabled={!selectedQuizId}
            className="px-8 py-4 bg-gradient-to-r from-rose-500 to-amber-500 text-white font-extrabold rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center gap-2 disabled:opacity-50 text-lg"
          >
            <Send size={20} />
            Preview & Send
          </button>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && createPortal(
            <div className="fixed inset-0 w-full  h-full bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-[400px] w-full shadow-2xl">
            <h3 className="text-xl font-bold text-gray-800 mb-5">Preview Invitation</h3>
            
            <div className="bg-[#EFEAE2] p-4 rounded-xl mb-6 whitespace-pre-wrap break-words font-sans text-gray-800 text-sm border border-gray-200 overflow-hidden">
              {generateFinalMessage()}
            </div>

            <div className="flex flex-col gap-3 justify-end">
              <button 
                onClick={handleSendWhatsApp}
                className="px-4 py-3 bg-green-500 text-white font-bold rounded-xl shadow-md hover:bg-green-600 transition-all flex items-center justify-center gap-2 w-full text-sm"
              >
                <Send size={18} />
                Send on WhatsApp
              </button>
              <button 
                onClick={() => setShowPreview(false)}
                className="px-4 py-3 text-gray-600 font-medium rounded-xl hover:bg-gray-100 transition-colors w-full text-sm border border-gray-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
    ,
        document.body
      )}
    </div>
  );
};

export default Invitation;
