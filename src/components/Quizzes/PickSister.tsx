import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../features/store';
import { setSistersAccounts } from '../../features/sistersAccountsSlice';
import { getSistersAccounts } from '../../services/user';
import type { SisterAccount } from '../../pages/Dashboard/Accounts/SisterList';
import SisterCard from './SisterCard';

interface PickSisterProps {
  selectedSister: SisterAccount | null;
  selectSister: (sister: SisterAccount) => void;
  unselectSister: () => void;
  localStoragePrefix?: "QUIZ" | "COUPON"
}

const PickSister: React.FC<PickSisterProps> = ({ selectedSister, selectSister, unselectSister, localStoragePrefix = "QUIZ" }) => {

  const dispatch = useDispatch();
  const sistersAccounts = useSelector((state: RootState) => state.sistersAccounts.accounts);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredSisters, setFilteredSisters] = useState<SisterAccount[]>([]);
  const [loading, setLoading] = useState(false); 

  // Fetch sistersAccounts is sistersACcount null
  useEffect(() => {
    if (!sistersAccounts) {
      const fetchAccounts = async () => {
        setLoading(true);
        try {
          const response = await getSistersAccounts();
          if (response.success && response.data) {
            dispatch(setSistersAccounts(response.data));
            setFilteredSisters(response.data);
          }
        } catch (error) {
          console.error("Failed to fetch sisters", error);
        } finally {
          setLoading(false);
        }
      };
      fetchAccounts();
    }else {
      setFilteredSisters(sistersAccounts);
    }
  }, [dispatch]);

  useEffect(() => {
    if (sistersAccounts && !selectedSister) {
      const storedSisterId = localStorage.getItem(`${localStoragePrefix}-selectedSisterId`);
      if (storedSisterId) {
        const foundSister = sistersAccounts.find(s => s._id === storedSisterId);
        if (foundSister) {
          selectSister(foundSister);
        }
      }
    }
  }, [sistersAccounts, selectedSister, selectSister]);

  const filter = () => {
    if (!sistersAccounts) return;
    const temp = sistersAccounts.filter( ( {name, phoneNumber})=> {
        return name.toLowerCase().includes(searchTerm.toLowerCase()) || phoneNumber.includes(searchTerm);
    } )
    setFilteredSisters(temp);
  }

  const clear = () => {
    setSearchTerm('');
    if (sistersAccounts) setFilteredSisters([...sistersAccounts]);
  }

  if (selectedSister) {
    return (
      <div className="bg-white/80 backdrop-blur-md p-6 rounded-3xl shadow-sm border border-white flex justify-between items-center transition-all">
        <div>
          <p className="text-sm text-gray-500 font-medium mb-1 uppercase tracking-wider">Selected Option</p>
          <p className="font-bold text-xl text-gray-800">{selectedSister.name}</p>
          <p className="text-gray-600 font-medium">{selectedSister.phoneNumber}</p>
        </div>
        <button 
          onClick={()=>unselectSister()}
          className="px-5 py-2.5 text-rose-600 font-semibold bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors border border-rose-100"
        >
          Unselect
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-md p-6 rounded-3xl shadow-sm border border-white transition-all max-h-[450px] flex flex-col">
      <div className="flex gap-4 mb-6 shrink-0">
        <div className="flex-1 relative">
          <input 
            type="text" 
            placeholder="Search by name or number..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-5 pr-4 py-3 border border-gray-200 rounded-2xl bg-white/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-400 transition-colors"
          />
        </div>

        <button 
          onClick={filter}
          className="px-6 py-3 bg-gray-900 text-white font-bold rounded-2xl shadow-sm hover:bg-gray-800 transition-colors"
        >
          Filter
        </button>
        {
         ( searchTerm || ( sistersAccounts && sistersAccounts.length > filteredSisters.length) )  && (
            <button 
              onClick={clear}
              className="px-6 py-3 bg-rose-50 text-rose-600 font-bold rounded-2xl border border-rose-100 hover:bg-rose-100 transition-colors"
            >
              Clear
            </button>
          )
        }
       
      </div>

      {loading && !sistersAccounts ? (
        <div className="flex justify-center py-10 flex-1 items-center">
           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500"></div>
        </div>
      ) : (
        <div className="space-y-3 flex-1 overflow-y-auto pr-2">
          {filteredSisters.length > 0 ? (
            filteredSisters.map(sister => (
              <SisterCard key={sister._id} sister={sister} onSelect={() => selectSister(sister)} />
            ))
          ) : (
            <p className="text-center text-gray-500 py-10 border border-dashed border-gray-200 rounded-2xl bg-gray-50 h-full flex items-center justify-center">No sisters found matching your search.</p>
          )}
        </div>
      )}
    </div>

  );
};

export default PickSister;
