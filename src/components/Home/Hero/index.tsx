import ActionButtons from './ActionButtons';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../features/store';
import { Link } from 'react-router';

const Hero = () => {
  const user = useSelector((state: RootState) => state.userProfile.profile);
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-rose-50 via-white to-amber-50 pt-32 pb-32">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-rose-200 opacity-40 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-amber-200 opacity-40 blur-3xl"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-rose-100 border border-rose-200 text-rose-700 text-sm font-semibold tracking-wide">
          ✨ The Modern Way to Gift
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-amber-500 tracking-tight mb-6">
          Celebrate the Bond of Protection
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600 mb-10">
          Make this Raksha Bandhan special. Send love, blessings, and instant cash gifts to your siblings securely and beautifully.
        </p>
        
        {user ? (
          <div className="flex flex-col items-center gap-4">
            <p className="text-lg text-rose-600 font-medium bg-rose-50 px-6 py-2 rounded-full border border-rose-100 shadow-sm">
              Welcome back, {user.name || 'friend'}!
            </p>
            <Link 
              to={user.role === 'SISTER' ? '/sisterDashboard' : '/dashboard'}
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold rounded-full text-white bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 shadow-lg transform transition hover:-translate-y-1"
            >
              Go to Dashboard
            </Link>
          </div>
        ) : (
          <ActionButtons />
        )}
        
        {/* Decorative elements */}
        <div className="mt-20 flex justify-center">
          <div className="relative w-full max-w-4xl h-64 md:h-96 bg-white/50 backdrop-blur-xl border border-white rounded-3xl shadow-2xl overflow-hidden p-8 flex items-center justify-center">
             <div className="text-center">
                <span className="text-6xl mb-4 block">🎁</span>
                <h3 className="text-2xl font-bold text-gray-800">Your E-Rakhi Preview</h3>
                <p className="text-gray-500 mt-2">Personalize your gift with beautiful digital Rakhis.</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
