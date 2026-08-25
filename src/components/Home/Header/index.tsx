import { Link } from 'react-router';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../features/store';

const Header = () => {
  const user = useSelector((state: RootState) => state.userProfile.profile);

  return (
    <header className="absolute top-0 left-0 right-0 z-50 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-rose-600 flex items-center gap-2">
              <span className="text-3xl">🪔</span> RakhiPay
            </Link>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <Link 
                to="/dashboard" 
                className="px-5 py-2.5 rounded-full bg-rose-600 text-white font-medium hover:bg-rose-700 transition shadow-md shadow-rose-200"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link to="/auth/login" className="text-gray-600 hover:text-rose-600 font-medium transition">
                  Log in
                </Link>
                <Link 
                  to="/auth/register-brother" 
                  className="px-5 py-2.5 rounded-full bg-rose-600 text-white font-medium hover:bg-rose-700 transition shadow-md shadow-rose-200"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
