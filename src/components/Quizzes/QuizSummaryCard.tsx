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

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 min-w-[280px]">
      <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Quiz STATS</h3>
      <div className="space-y-3 text-gray-600 font-medium">
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
