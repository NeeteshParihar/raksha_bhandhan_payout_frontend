import React, { useEffect, useState } from 'react';
import SisterForm from './SisterForm';
import SisterList, { type SisterAccount } from './SisterList';
import { getSistersAccounts, registerSister, deleteSisterAccount } from '../../../services/user';

const Accounts = () => {

  const [sistersACcount, setSistersACcount] = useState<SisterAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        setLoading(true);
        const response = await getSistersAccounts();
        if (response.success && response.data) {
          setSistersACcount(response.data);
        }
      } catch (err: any) {
        setError("Failed to fetch sister accounts");
      } finally {
        setLoading(false);
      }
    };
    fetchAccounts();
  }, []);

  const add = async ( name: string, phoneNumber: string ) => {
    const response = await registerSister({
      name,
      phoneNumber,
    });
    if (response.success && response.data) {
      setSistersACcount( prev => [...prev, response.data]);
      console.log("sister added success fully");
    }
  };

  const remove = async ( sisterId: string ) => {
    const response = await deleteSisterAccount(sisterId);
    if (response.success) {
      setSistersACcount(prev => prev.filter(s => s._id !== sisterId));
      console.log("sister account deleted successfully");
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* header */}
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-amber-500 tracking-tight">ACCOUNTS</h1>
        <p className="text-gray-500 mt-2 font-medium">Manage your registered sister accounts and send invitations.</p>
      </div>
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 font-medium rounded-2xl border border-red-100 shadow-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500"></div>
        </div>
      ) : (
        <>
          <SisterForm add={add} />
          <SisterList sisters={sistersACcount} remove={remove} />
        </>
      )}
    </div>
  );
};

export default Accounts;
