import { Link } from 'react-router';

const ActionButtons = () => {
  return (
    <div className="flex flex-col sm:flex-row justify-center gap-4">
      <Link 
        to="/auth/register-brother"
        className="px-8 py-4 text-lg font-medium rounded-full text-white bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 shadow-lg shadow-rose-200 transform transition hover:-translate-y-1"
      >
        Send a Gift
      </Link>
      <Link 
        to="/auth/login"
        className="px-8 py-4 text-lg font-medium rounded-full text-rose-600 bg-white border-2 border-rose-100 hover:border-rose-200 hover:bg-rose-50 shadow-sm transform transition hover:-translate-y-1"
      >
        Claim Gift
      </Link>
    </div>
  );
};

export default ActionButtons;
