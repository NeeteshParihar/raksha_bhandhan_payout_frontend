import React from 'react';
import type { BrotherAccount } from '../../features/brothersAccountSlice';

interface BrotherCardProps {
  brother: BrotherAccount;
  onSelect: () => void;
}

const BrotherCard: React.FC<BrotherCardProps> = ({ brother, onSelect }) => {
  return (
    <div className="flex items-center justify-between p-4 border border-gray-100 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow group cursor-pointer" onClick={onSelect}>
      <div>
        <p className="font-bold text-lg text-gray-800 group-hover:text-amber-600 transition-colors">{brother.name}</p>
        <p className="text-sm font-medium text-gray-500">{brother.phoneNumber}</p>
      </div>
      <button 
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
        className="px-5 py-2 bg-rose-50 text-rose-700 font-semibold rounded-xl border border-rose-200 hover:bg-rose-100 transition-colors"
      >
        Select
      </button>
    </div>
  );
};

export default BrotherCard;
