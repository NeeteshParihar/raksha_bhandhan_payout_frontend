import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical, Plus, RotateCcw } from 'lucide-react';
import type { IQuiz } from '../../services/quiz';

interface QuizCardProps {
  quiz: IQuiz;
  onAddQuestions: (quiz: IQuiz) => void;
  onResetQuiz: (quiz: IQuiz) => void;
}

const QuizCard: React.FC<QuizCardProps> = ({ quiz, onAddQuestions, onResetQuiz }) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'COMPLETED':
        return 'bg-green-100 text-green-700 border-green-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all flex items-center justify-between group">
      <div>
        <h3 className="text-lg font-bold text-gray-800">{quiz.title}</h3>
        <div className="mt-2">
          <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(quiz.status)}`}>
            {quiz.status.replace('_', ' ')}
          </span>
        </div>
      </div>

      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
        >
          <MoreVertical size={20} />
        </button>

        {showMenu && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-10">
            <button
              onClick={() => {
                setShowMenu(false);
                onAddQuestions(quiz);
              }}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-rose-50 hover:text-rose-600 flex items-center gap-2"
            >
              <Plus size={16} /> Add Questions
            </button>
            <button
              onClick={() => {
                setShowMenu(false);
                onResetQuiz(quiz);
              }}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-rose-50 hover:text-rose-600 flex items-center gap-2"
            >
              <RotateCcw size={16} /> Reset Quiz
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizCard;
