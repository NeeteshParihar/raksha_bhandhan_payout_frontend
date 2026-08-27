import  { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../../features/store';
import { setSistersAccounts, addSisterAccount, removeSisterAccount } from '../../../features/sistersAccountsSlice';
import SisterForm from './SisterForm';
import SisterList from './SisterList';
import { getSistersAccounts, registerSister, deleteSisterAccount } from '../../../services/user';

const Accounts = () => { 

  const dispatch = useDispatch();
  const sistersAccounts = useSelector((state: RootState) => state.sistersAccounts.accounts);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        setLoading(true);
        const response = await getSistersAccounts();
        if (response.success && response.data) {
          dispatch(setSistersAccounts(response.data));
        }
      } catch (err: any) {
        setError("Failed to fetch sister accounts");
      } finally {
        setLoading(false);
      }
    };
    // only fetch if the sisters accounts is null means not fetched at all 
    if( !sistersAccounts )
      fetchAccounts();
    else {
      setLoading(false);
    }
  }, [dispatch]);

  const add = async ( name: string, phoneNumber: string ) => {
    const response = await registerSister({
      name,
      phoneNumber,
    });
    if (response.success && response.data) {
      dispatch(addSisterAccount(response.data));
      console.log("sister added success fully");
    }
  };

  const remove = async ( sisterId: string ) => {
    const response = await deleteSisterAccount(sisterId);
    if (response.success) {
      dispatch(removeSisterAccount(sisterId));
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
          <SisterList sisters={sistersAccounts || []} remove={remove} />
        </>
      )}
    </div>
  );
};

export default Accounts;
