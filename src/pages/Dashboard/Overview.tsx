import { useNavigate } from 'react-router';
import { Rocket, BrainCircuit, Wallet } from 'lucide-react';

const Overview = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4 animate-fade-in">
      <div className="bg-white/80 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-white/60 max-w-2xl w-full relative overflow-hidden">
        
        {/* Decorative background blobs */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-rose-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 pointer-events-none transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 pointer-events-none transform -translate-x-1/2 translate-y-1/2"></div>
        
        <div className="relative z-10">
          <div className="w-24 h-24 bg-gradient-to-br from-rose-100 to-amber-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner border border-white">
            <Rocket className="w-12 h-12 text-rose-500 animate-pulse" />
          </div>
          
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-amber-600 mb-4 tracking-tight">
            Overview Coming Soon!
          </h1>
          
          <p className="text-lg text-gray-500 mb-10 max-w-lg mx-auto leading-relaxed">
            We're building a beautiful dashboard with rich insights, payout statistics, and quick actions. Meanwhile, you can navigate using the options below.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-lg mx-auto">
            <button
              onClick={() => navigate('/dashboard/quizzes')}
              className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-rose-50 to-white hover:from-rose-100 border border-rose-200 rounded-2xl transition-all hover:-translate-y-1 shadow-sm hover:shadow-md group"
            >
              <BrainCircuit className="w-8 h-8 text-rose-500 mb-3 group-hover:scale-110 transition-transform duration-300" />
              <span className="font-bold text-gray-800 text-lg">Manage Quizzes</span>
              <span className="text-sm text-gray-500 mt-1">Create & track quizzes</span>
            </button>

            <button
              onClick={() => navigate('/dashboard/accounts')}
              className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-amber-50 to-white hover:from-amber-100 border border-amber-200 rounded-2xl transition-all hover:-translate-y-1 shadow-sm hover:shadow-md group"
            >
              <Wallet className="w-8 h-8 text-amber-500 mb-3 group-hover:scale-110 transition-transform duration-300" />
              <span className="font-bold text-gray-800 text-lg">My Account</span>
              <span className="text-sm text-gray-500 mt-1">Manage funds & profile</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
