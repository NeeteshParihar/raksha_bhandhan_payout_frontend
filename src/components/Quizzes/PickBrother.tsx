import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../features/store';
import { setBrothersAccounts } from '../../features/brothersAccountSlice';
import { getBrothersAccounts } from '../../services/user';
import type { BrotherAccount } from '../../features/brothersAccountSlice';
import BrotherCard from './BrotherCard';
import { PhoneNumber } from '../ui/PhoneNumber';

interface PickBrotherProps {
  selectedBrother: BrotherAccount | null;
  selectBrother: (brother: BrotherAccount) => void;
  unselectBrother: () => void;
  localStoragePrefix?: "QUIZ" | "COUPON"
}

const PickBrother: React.FC<PickBrotherProps> = ({ selectedBrother, selectBrother, unselectBrother, localStoragePrefix = "QUIZ" }) => {

  const dispatch = useDispatch();
  const brothersAccounts = useSelector((state: RootState) => state.brothersAccounts.accounts);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredBrothers, setFilteredBrothers] = useState<BrotherAccount[]>([]);
  const [loading, setLoading] = useState(false); 

  // Fetch brothersAccounts if null
  useEffect(() => {
    if (!brothersAccounts) {
      const fetchAccounts = async () => {
        setLoading(true);
        try {
          const response = await getBrothersAccounts();
          if (response.success && response.data) {
            dispatch(setBrothersAccounts(response.data));
            setFilteredBrothers(response.data);
          }
        } catch (error) {
          console.error("Failed to fetch brothers", error);
        } finally {
          setLoading(false);
        }
      };
      fetchAccounts();
    }else {
      setFilteredBrothers(brothersAccounts);
    }
  }, [dispatch, brothersAccounts]);

  useEffect(() => {
    if (brothersAccounts && !selectedBrother) {
      const storedBrotherId = localStorage.getItem(`${localStoragePrefix}-selectedBrotherId`);
      if (storedBrotherId) {
        const foundBrother = brothersAccounts.find(s => s._id === storedBrotherId);
        if (foundBrother) {
          selectBrother(foundBrother);
        }
      }
    }
  }, [brothersAccounts, selectedBrother, selectBrother, localStoragePrefix]);

  const filter = () => {
    if (!brothersAccounts) return;
    const temp = brothersAccounts.filter( ( {name, phoneNumber})=> {
        return name.toLowerCase().includes(searchTerm.toLowerCase()) || phoneNumber.includes(searchTerm);
    } )
    setFilteredBrothers(temp);
  }

  const clear = () => {
    setSearchTerm('');
    if (brothersAccounts) setFilteredBrothers([...brothersAccounts]);
  }

  if (selectedBrother) {
    return (
      <div className="bg-white/80 backdrop-blur-md p-6 rounded-3xl shadow-sm border border-white flex justify-between items-center transition-all">
        <div>
          <p className="text-sm text-gray-500 font-medium mb-1 uppercase tracking-wider">Selected Option</p>
          <p className="font-bold text-xl text-gray-800">{selectedBrother.name}</p>
          <PhoneNumber mode="display" value={selectedBrother.phoneNumber} className="text-gray-600 font-medium" />
        </div>
        <button 
          onClick={()=>unselectBrother()}
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
         ( searchTerm || ( brothersAccounts && brothersAccounts.length > filteredBrothers.length) )  && (
            <button 
              onClick={clear}
              className="px-6 py-3 bg-rose-50 text-rose-600 font-bold rounded-2xl border border-rose-100 hover:bg-rose-100 transition-colors"
            >
              Clear
            </button>
          )
        }
       
      </div>

      {loading && !brothersAccounts ? (
        <div className="flex justify-center py-10 flex-1 items-center">
           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500"></div>
        </div>
      ) : (
        <div className="space-y-3 flex-1 overflow-y-auto pr-2">
          {filteredBrothers.length > 0 ? (
            filteredBrothers.map(brother => (
              <BrotherCard key={brother._id} brother={brother} onSelect={() => selectBrother(brother)} />
            ))
          ) : (
            <p className="text-center text-gray-500 py-10 border border-dashed border-gray-200 rounded-2xl bg-gray-50 h-full flex items-center justify-center">No brothers found matching your search.</p>
          )}
        </div>
      )}
    </div>

  );
};

export default PickBrother;
