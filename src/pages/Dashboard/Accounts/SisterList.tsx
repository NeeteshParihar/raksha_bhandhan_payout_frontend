import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router';

export interface SisterAccount {
  _id: string;
  name: string;
  phoneNumber: string;
  countryCode?: string;
  role?: string;
  brotherId?: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

interface SisterListProps {
  sisters: SisterAccount[];
  remove:  ( _id : string) => Promise<void>;
}

const SisterList: React.FC<SisterListProps> = ({ sisters, remove }) => {
  const navigate = useNavigate();
  const [sisterToDelete, setSisterToDelete] = useState<SisterAccount | null>(null);
  const [confirmPhone, setConfirmPhone] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const handleSendInvitation = (sister: SisterAccount) => {
    navigate(`/dashboard/invitation/${sister._id}`);
  };

  const handleDeleteClick = (sister: SisterAccount) => {
    setSisterToDelete(sister);
    setConfirmPhone('');
  };

  const confirmDelete = async () => {
    if (sisterToDelete && confirmPhone === sisterToDelete.phoneNumber) {
      setIsDeleting(true);
      setDeleteError('');
      try {
        const identifier = sisterToDelete._id;
        await remove(identifier);
        setSisterToDelete(null);
        setConfirmPhone('');
      } catch (err: any) {
        setDeleteError(err.response?.data?.message || err.message || 'Failed to delete account');
        setTimeout( () => {
        setDeleteError("");
        }, 5000);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-md p-6 rounded-3xl shadow-sm border border-white relative">
      <h3 className="text-xl font-bold text-gray-800 mb-6">Registered Accounts</h3>
      {sisters.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
          <p className="text-gray-500">No sisters registered yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sisters.map((sister, index) => (
            <div key={sister._id || index} className="flex flex-col md:flex-row md:items-center justify-between p-5 border border-gray-100 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow">
              <div className="mb-4 md:mb-0">
                <p className="font-bold text-lg text-gray-800">{sister.name}</p>
                <p className="text-sm font-medium text-gray-500">{sister.phoneNumber}</p>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => handleSendInvitation(sister)}
                  className="px-5 py-2.5 bg-amber-50 text-amber-700 font-semibold rounded-xl border border-amber-200 hover:bg-amber-100 transition-colors"
                >
                  Send Invitation
                </button>
                <button 
                  onClick={() => handleDeleteClick(sister)}
                  className="px-5 py-2.5 bg-red-50 text-red-600 font-semibold rounded-xl border border-red-200 hover:bg-red-100 transition-colors"
                >
                  DELETE
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirmation Modal */}
      {sisterToDelete && createPortal(
        <div className="fixed inset-0 w-full h-full bg-black/40 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl transform transition-all">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Confirm Deletion</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Are you sure you want to delete the account for <span className="font-bold text-gray-900">{sisterToDelete.name}</span>? 
              This action cannot be undone.
            </p>
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Type <span className="font-bold text-rose-600 tracking-wider bg-rose-50 px-2 py-1 rounded">{sisterToDelete.phoneNumber}</span> to confirm:
              </label>
              <input 
                type="text" 
                value={confirmPhone}
                onChange={(e) => setConfirmPhone(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-400 transition-shadow"
                placeholder="Enter phone number"
                disabled={isDeleting}
              />
            </div>
            {deleteError && (
              <div className="mb-6 p-3 bg-red-50 text-red-600 text-sm font-medium rounded-xl border border-red-100">
                {deleteError}
              </div>
            )}
            <div className="flex gap-3 justify-end">
              <button 
                onClick={() => {
                  setSisterToDelete(null);
                  setConfirmPhone('');
                  setDeleteError('');
                }}
                disabled={isDeleting}
                className="px-6 py-2.5 text-gray-600 font-medium rounded-xl hover:bg-gray-100 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                disabled={confirmPhone !== sisterToDelete.phoneNumber || isDeleting}
                className="px-6 py-2.5 bg-red-600 text-white font-medium rounded-xl shadow-md hover:bg-red-700 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-red-600 disabled:hover:shadow-md flex items-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Deleting...
                  </>
                ) : (
                  'Delete Account'
                )}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default SisterList;
