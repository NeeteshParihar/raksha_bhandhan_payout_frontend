import React, { useState } from 'react';
import type { IQuestion } from '../../services/quiz';
import { ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import { createPortal } from 'react-dom';
import { deleteQuestionFromQuiz } from '../../services/quiz';

interface QuestionCardProps {
  question: IQuestion;
  isExpanded: boolean;
  onToggle: () => void;
  index: number;
  quizId?: string;
  onDeleteSuccess?: (questionId: string) => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question, isExpanded, onToggle, index, quizId, onDeleteSuccess }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!quizId || !onDeleteSuccess) return;
    setIsDeleting(true);
    try {
      await deleteQuestionFromQuiz(quizId, question._id);
      setShowDeleteConfirm(false);
      onDeleteSuccess(question._id);
    } catch (error) {
      console.error('Failed to delete question:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
      <div 
        className="flex justify-between items-start cursor-pointer"
        onClick={onToggle}
      >
        <div className="flex gap-4">
          <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center font-bold shrink-0 mt-0.5">
            {index + 1}
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800 leading-snug">{question.quesDesc}</h3>
          </div>
        </div>
        <button className="text-gray-400 hover:text-gray-700 p-1 shrink-0 ml-4">
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
      </div>

      {isExpanded && (
        <div className="mt-5 pt-5 border-t border-gray-100 md:pl-12">
          {question.questionMediaUrl && (
            <div className="mb-5">
              <img 
                src={question.questionMediaUrl} 
                alt="Question media" 
                className="rounded-xl max-h-64 object-cover shadow-sm border border-gray-100"
              />
            </div>
          )}

          <div className="flex flex-wrap gap-2 mb-6">
            <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-bold rounded-full">
              Level: {question.level}
            </span>
            <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full">
              Type: {question.questionType}
            </span>
            <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
              Amount: ₹{question.scoreAmount}
            </span>
          </div>

          {question.questionType === 'MCQ' && question.optionsList && question.optionsList.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-bold text-gray-500 mb-3 uppercase tracking-wider">Options</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {question.optionsList.map((option, i) => (
                  <div key={option._id} className="border border-gray-100 rounded-xl p-3 flex gap-3 items-center bg-gray-50">
                    <div className="w-6 h-6 rounded-full bg-white border border-gray-200 text-gray-500 flex items-center justify-center text-xs font-bold shrink-0">
                      {i + 1}
                    </div>
                    {option.type === 'IMG' ? (
                      <img src={option.value} alt={`Option ${i+1}`} className="h-16 w-16 object-cover rounded-lg border border-gray-200" />
                    ) : (
                      <span className="text-gray-800 font-medium">{option.value}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {question.answerList && question.answerList.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-bold text-gray-500 mb-2 uppercase tracking-wider">Answers</h4>
              <div className="flex gap-2 flex-wrap">
                {question.answerList.map((ans, i) => (
                  <span key={i} className="px-4 py-2 bg-green-50 border border-green-200 text-green-700 font-bold rounded-lg text-sm shadow-sm">
                    {ans}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {quizId && onDeleteSuccess && (
            <div className="flex justify-end pt-4 border-t border-gray-100">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDeleteConfirm(true);
                }}
                className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 font-bold rounded-xl text-sm flex items-center gap-2 transition-colors"
              >
                <Trash2 size={16} /> Delete Question
              </button>
            </div>
          )}
        </div>
      )}

      {showDeleteConfirm && createPortal(
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl flex flex-col items-center">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-6">
              <Trash2 size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Delete Question?</h2>
            <p className="text-gray-500 text-center mb-8">
              Are you sure you want to delete this question? This action cannot be undone.
            </p>
            <div className="flex gap-4 w-full">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors shadow-md shadow-red-200 disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default QuestionCard;
