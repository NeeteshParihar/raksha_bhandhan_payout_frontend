import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { createPortal } from 'react-dom';
import { useSelector } from 'react-redux';
import { ArrowLeft, Gift, Brain, Send, CheckCircle2, MessageSquare } from 'lucide-react';
import type { RootState } from '../../../features/store';
import { getQuizzesOfSister, type IQuiz } from '../../../services/quiz';
import { getCouponsOfSister, type ICoupon } from '../../../services/coupon';
import { getSistersAccounts } from '../../../services/user';
import { PhoneNumber } from '../../../components/ui/PhoneNumber';

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
  const [allQuizzesCompleted, setAllQuizzesCompleted] = useState(false);
  
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
          getQuizzesOfSister(sisterId, ["READY"], ["PENDING", "IN_PROGRESS"]),
          getCouponsOfSister(sisterId)
        ]);

        if (quizzesRes.success && quizzesRes.data) {
         
          setQuizzes(quizzesRes.data);
          // Auto-select first non-completed quiz
          const firstAvailable = quizzesRes.data.find(q => q.status !== 'COMPLETED' && q.quizState !== "DRAFT");
          if (firstAvailable) {
            setSelectedQuizId(firstAvailable._id);
          } else {
            // All quizzes completed — let user decide what to do
            setAllQuizzesCompleted(true);
          }
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
    return `${window.location.origin}/sisterDashboard/myquizzes/quiz/${selectedQuizId}`;
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

const handleQuizChoose = (quiz: IQuiz) => {
    if( quiz.status === "COMPLETED" || quiz.quizState === "DRAFT" ) return;
    setSelectedQuizId(quiz._id)
  }

  return (
    <div className="max-w-4xl mx-auto pb-20 mt-4 md:mt-10">
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
            <PhoneNumber mode="display" value={sister.phoneNumber} className="text-gray-600 font-medium" />
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
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <Brain size={20} className="text-rose-500" />
              Select Quiz (Required)
            </h2>
            <button
              onClick={() => {
                if (sisterId) localStorage.setItem('QUIZ-selectedSisterId', sisterId);
                navigate('/dashboard/quizzes');
              }}
              className="text-sm font-semibold text-rose-500 hover:text-rose-600 transition-colors bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-lg"
            >
              Manage Quizzes
            </button>
          </div>

          {allQuizzesCompleted ? (
            <div className="text-center py-6 px-4 bg-gray-50 rounded-xl border border-dashed border-gray-200">
              <p className="text-gray-500 font-medium mb-1">All quizzes have been COMPLETED or DRAFT</p>
              <p className="text-gray-400 text-sm mb-4">Create a new quiz to send a fresh invitation.</p>
              <button
                onClick={() => {
                  if (sisterId) localStorage.setItem('QUIZ-selectedSisterId', sisterId);
                  navigate('/dashboard/quizzes');
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-semibold rounded-xl transition-colors text-sm"
              >
                <Brain size={16} />
                Create New Quiz
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {quizzes.map(quiz => {
                const isCompleted = quiz.status === 'COMPLETED';
                const isDraft = quiz.quizState !== "READY";
                const isSelected = selectedQuizId === quiz._id;
                return (
                  <div
                    key={quiz._id}
                    onClick={ ()=>handleQuizChoose(quiz) }
                    title={isCompleted  ? 'This quiz has already been completed and cannot be sent again' : isDraft? "quiz is draft and cannot be sent": undefined}
                    className={`p-4 rounded-xl border-2 transition-all flex justify-between items-center ${
                      isCompleted
                        ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-50'
                        : isSelected
                          ? 'border-rose-500 bg-rose-50 cursor-pointer'
                          : 'border-gray-100 hover:border-gray-300 cursor-pointer'
                    }`}
                  >
                    <div>
                      <p className={`font-bold ${
                        isCompleted ? 'text-gray-400' : isSelected ? 'text-rose-700' : 'text-gray-700'
                      }`}>{quiz.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-xs text-gray-500">Status: {quiz.status.replace('_', ' ')}</p>
                        {isCompleted && (
                          <span className="text-[10px] font-semibold bg-gray-200 text-gray-500 px-1.5 py-0.5 rounded-full uppercase tracking-wide">Unavailable</span>
                        )}
                      </div>
                    </div>
                    {isSelected && !isCompleted && <CheckCircle2 className="text-rose-500" size={20} />}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Coupon Selection */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <Gift size={20} className="text-amber-500" />
              Select Coupon (Optional)
            </h2>
            <button
              onClick={() => {
                navigate('/dashboard/coupons');
              }}
              className="text-sm font-semibold text-amber-600 hover:text-amber-700 transition-colors bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-lg"
            >
              Manage Coupons
            </button>
          </div>
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

              {coupons.map(coupon => {
                const isUsed = coupon.status === 'APPLIED';
                const isSelected = selectedCouponId === coupon._id;
                return (
                  <div
                    key={coupon._id}
                    onClick={() => !isUsed && setSelectedCouponId(coupon._id)}
                    title={isUsed ? 'This coupon has already been used' : undefined}
                    className={`p-4 rounded-xl border-2 transition-all flex justify-between items-center ${
                      isUsed
                        ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-50'
                        : isSelected
                          ? 'border-amber-500 bg-amber-50 cursor-pointer'
                          : 'border-gray-100 hover:border-gray-300 cursor-pointer'
                    }`}
                  >
                    <div>
                      <p className={`font-bold ${
                        isUsed ? 'text-gray-400' : isSelected ? 'text-amber-700' : 'text-gray-700'
                      }`}>₹{coupon.amount}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-xs font-mono text-gray-500">{coupon.couponCode}</p>
                        {isUsed && (
                          <span className="text-[10px] font-semibold bg-gray-200 text-gray-500 px-1.5 py-0.5 rounded-full uppercase tracking-wide">Used</span>
                        )}
                      </div>
                    </div>
                    {isSelected && !isUsed && <CheckCircle2 className="text-amber-500" size={20} />}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Preview Button */}
        <div className="flex justify-end pt-4">
          <button 
            onClick={() => setShowPreview(true)}
            disabled={!selectedQuizId || allQuizzesCompleted}
            className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-rose-500 to-amber-500 text-white font-extrabold rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 text-lg"
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
