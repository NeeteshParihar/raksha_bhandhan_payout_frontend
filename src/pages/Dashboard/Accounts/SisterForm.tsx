import React, { useState } from 'react';
import { PhoneNumber } from '../../../components/ui/PhoneNumber';

interface SisterFormProps {
  add: (name: string, phoneNumber: string ) => void;
}

const SisterForm: React.FC<SisterFormProps> = ({ add }) => {
  
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [addError, setAddError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;
    
    setIsAdding(true);
    setAddError('');
    try {
      await add(name, phone);
      setName('');
      setPhone('');
    } catch (err: any) {
      setAddError(err.response?.data?.message || err.message || 'Failed to register sister');
      setTimeout( () => { 
        setAddError("");
      }, 5000);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-md p-6 rounded-3xl shadow-sm border border-white mb-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Register Sister</h3>
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
        <input 
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isAdding}
          className="flex-1 px-4 py-3 border border-gray-200 rounded-2xl bg-white/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-400 transition-colors disabled:opacity-50"
        />
        <div className="flex-1 flex">
          <PhoneNumber 
            mode="input"
            placeholder="Phone Number"
            prefix="+91"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled={isAdding}
            className="w-full"
          />
        </div>
        <button 
          type="submit"
          disabled={isAdding || !name || !phone}
          className="w-full md:w-auto px-8 py-4 md:py-3 bg-gradient-to-r from-rose-500 to-amber-500 text-white font-bold rounded-2xl shadow-md transform transition hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center min-w-[120px] text-lg md:text-base"
        >
          {isAdding ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            'Add Sister'
          )}
        </button>
      </form>

      {addError && (
        <div className="mt-4 p-3 bg-red-50 text-red-600 text-sm font-medium rounded-xl border border-red-100">
          {addError}
        </div>
      )}

      <p className="mt-4 text-sm text-gray-500 font-medium italic">
        Note: The default password for the sister account is her phone number.
      </p>
    </div>
  );
};

export default SisterForm;
