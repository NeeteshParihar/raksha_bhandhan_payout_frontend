import { NavLink, Outlet, useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';
import { logout } from '../../features/userProfileSlice';
import { logoutUser } from '../../services/user';

const SisterDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      // Dispatch logout to clear Redux state
      dispatch(logout());
      
      // Redirect to home page
      navigate('/');
    }
  };

  const navItems = [
    { name: 'My Quizzes', path: '/sisterDashboard/myquizzes', icon: '🧠', end: false },
    { name: 'Account', path: '/sisterDashboard/account', icon: '👤', end: false },
  ];

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
      
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white/95 backdrop-blur-xl border-r border-gray-200 shadow-sm relative z-50">
        <div className="p-6">
          <div className="flex items-center justify-between mb-10">
            <div className="text-2xl font-bold text-amber-600 flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
              <span className="text-3xl">🪔</span> RakhiPay
            </div>
          </div>

          <nav className="space-y-3">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3.5 rounded-2xl font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-amber-400 to-rose-400 text-white shadow-md transform hover:-translate-y-0.5'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`
                }
              >
                <span className="text-xl">{item.icon}</span>
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-3 px-4 py-3.5 w-full rounded-2xl font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 border border-transparent hover:border-red-100 transition-all duration-200"
          >
            <span className="text-xl">🚪</span>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-gradient-to-br from-amber-50/50 via-white to-rose-50/50 relative flex flex-col">
        {/* Subtle background decoration inside the dashboard */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-rose-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 pointer-events-none"></div>
        
        {/* Mobile Header (Simplified) */}
        <div className="md:hidden flex items-center justify-center p-4 bg-white/70 backdrop-blur-lg border-b border-gray-100 sticky top-0 z-30 shadow-sm">
          <div className="text-xl font-bold text-amber-600 flex items-center gap-2">
            <span className="text-2xl">🪔</span> RakhiPay
          </div>
        </div>

        <div className="p-4 pb-24 md:p-8 md:pb-8 max-w-6xl mx-auto w-full relative z-10 flex-1">
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-gray-200 z-50 flex items-center justify-around pb-safe shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.end}
            className={({ isActive }) =>
              `flex flex-col items-center pt-3 pb-2 w-full transition-colors relative ${
                isActive ? 'text-amber-600' : 'text-gray-500 hover:text-gray-900'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && <div className="absolute top-0 w-12 h-1 bg-amber-500 rounded-b-full"></div>}
                <span className="text-2xl mb-1">{item.icon}</span>
                <span className="text-[11px] font-bold tracking-wide">{item.name}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default SisterDashboard;
