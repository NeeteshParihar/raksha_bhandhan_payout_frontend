import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';
import { logout } from '../../features/userProfileSlice';

const BrotherDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    // Dispatch logout to clear Redux state
    dispatch(logout());
    
    // In a full implementation, you would also call an API to clear the HTTP-only cookie here
    
    // Redirect to home page
    navigate('/');
  };

  const navItems = [
    { name: 'Overview', path: '/dashboard', icon: '📊', end: true },
    { name: 'Accounts', path: '/dashboard/accounts', icon: '🏦', end: false },
    { name: 'Quizzes', path: '/dashboard/quizzes', icon: '🧠', end: false },
    { name: 'Coupons', path: '/dashboard/coupons', icon: '🎟️', end: false },    
  ];

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 w-64 bg-white/95 backdrop-blur-xl border-r border-gray-200 flex flex-col shadow-2xl md:shadow-sm z-50 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-10">
            <div className="text-2xl font-bold text-rose-600 flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
              <span className="text-3xl">🪔</span> RakhiPay
            </div>
            <button 
              className="md:hidden text-gray-400 hover:text-rose-600 transition"
              onClick={() => setIsSidebarOpen(false)}
              aria-label="Close menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <nav className="space-y-3">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                end={item.end}
                onClick={() => setIsSidebarOpen(false)} // Close sidebar on click (mobile)
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3.5 rounded-2xl font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow-md transform hover:-translate-y-0.5'
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
      <main className="flex-1 overflow-y-auto bg-gradient-to-br from-rose-50/50 via-white to-amber-50/50 relative flex flex-col">
        {/* Subtle background decoration inside the dashboard */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-rose-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 pointer-events-none"></div>
        
        {/* Mobile Header (Hamburger Menu) */}
        <div className="md:hidden flex items-center justify-between p-4 bg-white/70 backdrop-blur-lg border-b border-gray-100 sticky top-0 z-30">
          <div className="text-xl font-bold text-rose-600 flex items-center gap-2">
            <span className="text-2xl">🪔</span> RakhiPay
          </div>
          <button 
            className="p-2 text-gray-600 hover:bg-rose-50 hover:text-rose-600 rounded-xl transition shadow-sm bg-white"
            onClick={() => setIsSidebarOpen(true)}
            aria-label="Open menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        <div className="p-4 md:p-8 max-w-6xl mx-auto w-full relative z-10 flex-1">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default BrotherDashboard;
