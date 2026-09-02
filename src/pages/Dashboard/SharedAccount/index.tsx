import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import type { RootState } from '../../../features/store';
import { updatePassword, logoutUser } from '../../../services/user';
import { logout } from '../../../features/userProfileSlice';
import { User, Phone, Shield, KeyRound, AlertCircle, CheckCircle2, LogOut } from 'lucide-react';
import { PhoneNumber } from '../../../components/ui/PhoneNumber';

const SharedAccount: React.FC = () => {
  const user = useSelector((state: RootState) => state.userProfile.profile);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setIsUpdating(true);
    try {
      const res = await updatePassword(password, confirmPassword);
      if (res.success) {
        setSuccess('Password updated successfully!');
        setPassword('');
        setConfirmPassword('');
      } else {
        setError(res.message || 'Failed to update password.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'An error occurred while updating the password.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      dispatch(logout());
      navigate('/');
    }
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-full min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-20 mt-4 md:mt-10 px-4 md:px-0 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">Account Settings</h1>
          <p className="text-gray-500 font-medium text-sm mt-1">Manage your profile and security</p>
        </div>
        <button 
          onClick={handleLogout}
          className="px-5 py-2.5 bg-rose-50 text-rose-600 hover:bg-rose-100 hover:text-rose-700 font-bold rounded-xl transition-colors flex items-center gap-2 shadow-sm border border-rose-100 md:hidden"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>

      {/* User Information Card */}
      <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-full -z-0 opacity-50"></div>
        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2 relative z-10">
          <User className="text-indigo-500" size={24} />
          Profile Information
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex items-start gap-4">
            <div className="p-3 bg-white rounded-xl shadow-sm text-indigo-500 shrink-0">
              <User size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Full Name</p>
              <p className="font-bold text-gray-800 text-lg">{user.name}</p>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex items-start gap-4">
            <div className="p-3 bg-white rounded-xl shadow-sm text-amber-500 shrink-0">
              <Phone size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Phone Number</p>
              <PhoneNumber mode="display" value={`${user.countryCode} ${user.phoneNumber}`} className="font-bold text-gray-800 text-lg" />
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex items-start gap-4 md:col-span-2">
            <div className="p-3 bg-white rounded-xl shadow-sm text-emerald-500 shrink-0">
              <Shield size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Account Role</p>
              <p className="font-bold text-gray-800 text-lg capitalize">{user.role.toLowerCase()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Password Reset Section */}
      <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <KeyRound className="text-rose-500" size={24} />
          Change Password
        </h2>

        {error && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl flex items-center gap-3">
            <AlertCircle size={20} className="shrink-0" />
            <span className="font-bold">{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl flex items-center gap-3">
            <CheckCircle2 size={20} className="shrink-0" />
            <span className="font-bold">{success}</span>
          </div>
        )}

        <form onSubmit={handleUpdatePassword} className="space-y-5">
          <div className="flex flex-col md:flex-row gap-5">
            <div className="flex-1">
              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">New Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isUpdating}
                placeholder="Enter new password"
                className="w-full p-4 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-400 font-medium text-gray-800 transition-colors disabled:opacity-50"
              />
            </div>
            
            <div className="flex-1">
              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isUpdating}
                placeholder="Confirm new password"
                className="w-full p-4 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-400 font-medium text-gray-800 transition-colors disabled:opacity-50"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={isUpdating || !password || !confirmPassword}
              className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-rose-500 to-amber-500 text-white font-extrabold rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-70 text-lg"
            >
              {isUpdating ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                'Update Password'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SharedAccount;
