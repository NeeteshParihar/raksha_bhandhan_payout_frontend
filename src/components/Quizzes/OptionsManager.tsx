import React, { useState, useRef, useEffect } from 'react';
import { Trash2, Plus, CheckCircle2, Circle } from 'lucide-react';
import type { OptionType } from '../../services/quiz';

export interface LocalOption {
  id: string;
  type: OptionType;
  value: string | File;
  isCorrect: boolean;
}

interface OptionsManagerProps {
  options: LocalOption[];
  setOptions: React.Dispatch<React.SetStateAction<LocalOption[]>>;
}

const OptionsManager: React.FC<OptionsManagerProps> = ({ options, setOptions }) => {
  const [newType, setNewType] = useState<OptionType>('TEXT');
  const [newText, setNewText] = useState('');
  const [newFile, setNewFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (newFile) {
      const url = URL.createObjectURL(newFile);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null);
    }
  }, [newFile]);

  const handleAddOption = () => {
    if (newType === 'TEXT' && !newText.trim()) return;
    if (newType === 'IMG' && !newFile) return;

    const newOpt: LocalOption = {
      id: Math.random().toString(36).substring(7),
      type: newType,
      value: newType === 'TEXT' ? newText : newFile!,
      isCorrect: false
    };

    setOptions([...options, newOpt]);
    
    // Reset form
    setNewText('');
    setNewFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeOption = (id: string) => {
    setOptions(options.filter(o => o.id !== id));
  };

  const toggleCorrect = (id: string) => {
    // Allows multiple correct answers if the user selects them
    setOptions(options.map(o => 
      o.id === id ? { ...o, isCorrect: !o.isCorrect } : o
    ));
  };

  return (
    <div className="space-y-6">
      {/* Existing Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {options.map((opt, index) => (
          <div 
            key={opt.id} 
            className={`border ${opt.isCorrect ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-white'} rounded-xl p-4 flex gap-3 items-center relative transition-colors`}
          >
            <button 
              type="button"
              onClick={() => toggleCorrect(opt.id)}
              className={`transition-colors shrink-0 ${opt.isCorrect ? 'text-green-500' : 'text-gray-300 hover:text-green-500'}`}
              title="Mark as correct answer"
            >
              {opt.isCorrect ? <CheckCircle2 /> : <Circle />}
            </button>
            
            <div className="flex-1 min-w-0">
              {opt.type === 'IMG' ? (
                <div className="h-16 w-16 relative">
                  <img 
                    src={URL.createObjectURL(opt.value as File)} 
                    alt={`Option ${index + 1}`} 
                    className="h-full w-full object-cover rounded-lg border border-gray-200"
                  />
                </div>
              ) : (
                <p className="text-gray-800 font-medium truncate" title={opt.value as string}>{opt.value as string}</p>
              )}
            </div>

            <button 
              type="button"
              onClick={() => removeOption(opt.id)}
              className="p-2 text-gray-400 hover:text-rose-600 bg-gray-50 hover:bg-rose-50 rounded-lg transition-colors shrink-0"
              title="Remove Option"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      {/* Add New Option Form */}
      <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 shadow-inner">
        <h4 className="text-sm font-bold text-gray-700 mb-4 uppercase tracking-wider flex items-center gap-2">
          <Plus size={16} /> New Option
        </h4>
        
        <div className="flex flex-col sm:flex-row gap-3 items-start">
          <select 
            value={newType}
            onChange={(e) => {
              setNewType(e.target.value as OptionType);
              setNewText('');
              setNewFile(null);
            }}
            className="p-2.5 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-rose-400 font-medium text-gray-700"
          >
            <option value="TEXT">Text</option>
            <option value="IMG">Image</option>
          </select>

          <div className="flex-1 w-full">
            {newType === 'TEXT' ? (
              <input 
                type="text" 
                placeholder="Enter option text..."
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                className="w-full p-2.5 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-rose-400"
              />
            ) : (
              <div>
                <input 
                  type="file" 
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      setNewFile(e.target.files[0]);
                    }
                  }}
                  className="w-full p-2 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-rose-50 file:text-rose-600 hover:file:bg-rose-100"
                />
                {previewUrl && (
                  <div className="mt-3">
                    <img src={previewUrl} alt="Preview" className="h-20 w-20 object-cover rounded-lg border border-gray-200 shadow-sm" />
                  </div>
                )}
              </div>
            )}
          </div>

          <button 
            type="button"
            onClick={handleAddOption}
            disabled={(newType === 'TEXT' && !newText.trim()) || (newType === 'IMG' && !newFile)}
            className="px-6 py-2.5 bg-gray-900 text-white font-bold rounded-xl shadow-sm hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
          >
            Add Option
          </button>
        </div>
      </div>

      {options.length > 0 && options.filter(o => o.isCorrect).length === 0 && (
        <p className="text-sm text-amber-600 font-medium flex items-center gap-1">
          <Circle size={14} className="inline" /> Don't forget to mark at least one option as the correct answer!
        </p>
      )}
    </div>
  );
};

export default OptionsManager;
