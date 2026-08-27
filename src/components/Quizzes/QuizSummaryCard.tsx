import React from 'react';
import type { IQuizDetails, IQuizAttempts } from '../../services/quiz';

interface QuizSummaryCardProps {
  quizDetails: IQuizDetails;
  attempts: IQuizAttempts | null;
}

const QuizSummaryCard: React.FC<QuizSummaryCardProps> = ({ quizDetails, attempts }) => {
  const totalQuestions = quizDetails.questions.length;
  const totalAttempted = attempts?.questions?.length || 0;
  const totalCorrect = attempts?.questions?.filter(q => q.isCorrect).length || 0;
  const totalWrong = attempts?.questions?.filter(q => !q.isCorrect).length || 0;
  const amountEarned = attempts?.totalAmountEarned || 0;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'IN_PROGRESS': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'COMPLETED': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 min-w-[280px]">
      <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Quiz STATS</h3>
      <div className="space-y-3 text-gray-600 font-medium">
        <div className="flex justify-between items-center mb-4 border-b border-gray-50 pb-3">
           <span className="uppercase text-xs text-gray-400">Status</span> 
           <span className={`text-[10px] font-bold px-2 py-1 rounded border uppercase tracking-wider ${getStatusColor(quizDetails.status)}`}>
             {quizDetails.status.replace('_', ' ')}
           </span>
        </div>
        <div className="flex justify-between"><span className="uppercase text-xs text-gray-400">Total Amount</span> <span className="text-gray-800">₹{quizDetails.totalAmount || 0}</span></div>
        <div className="flex justify-between"><span className="uppercase text-xs text-amber-500">Amount Earned</span> <span className="font-bold text-amber-600">₹{amountEarned}</span></div>
        <div className="flex justify-between mt-4"><span className="uppercase text-xs text-gray-400">Total Questions</span> <span>{totalQuestions}</span></div>
        <div className="flex justify-between"><span className="uppercase text-xs text-gray-400">Attempted</span> <span>{totalAttempted}</span></div>
        <div className="flex justify-between"><span className="uppercase text-xs text-green-500">Correct</span> <span className="text-green-600">{totalCorrect}</span></div>
        <div className="flex justify-between"><span className="uppercase text-xs text-red-400">Wrong</span> <span className="text-red-500">{totalWrong}</span></div>
      </div>
    </div>
  );
};

export default QuizSummaryCard;
