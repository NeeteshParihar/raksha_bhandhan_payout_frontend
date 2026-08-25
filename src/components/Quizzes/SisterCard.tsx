import React from 'react';
import type { SisterAccount } from '../../pages/Dashboard/Accounts/SisterList';

interface SisterCardProps {
  sister: SisterAccount;
  onSelect: () => void;
}

const SisterCard: React.FC<SisterCardProps> = ({ sister, onSelect }) => {
  return (
    <div className="flex items-center justify-between p-4 border border-gray-100 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow group cursor-pointer" onClick={onSelect}>
      <div>
        <p className="font-bold text-lg text-gray-800 group-hover:text-rose-600 transition-colors">{sister.name}</p>
        <p className="text-sm font-medium text-gray-500">{sister.phoneNumber}</p>
      </div>
      <button 
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
        className="px-5 py-2 bg-amber-50 text-amber-700 font-semibold rounded-xl border border-amber-200 hover:bg-amber-100 transition-colors"
      >
        Select
      </button>
    </div>
  );
};

export default SisterCard;
