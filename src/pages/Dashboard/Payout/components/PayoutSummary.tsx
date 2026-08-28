import type { IQuizAttempts } from '../../../../services/quiz';

interface PayoutSummaryProps {
  attempts: IQuizAttempts | null;
  quizEarnedAmount: number;
}

const PayoutSummary: React.FC<PayoutSummaryProps> = ({ attempts, quizEarnedAmount }) => {
  return (
    <div className="bg-gray-50 rounded-lg p-5 border border-gray-100 h-full">
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Quiz Earnings</h3>
      <div className="flex justify-between items-center mb-3 pb-3 border-b border-gray-200">
        <span className="text-gray-600">Quiz Completed</span>
        <span className="font-medium text-gray-900">₹{quizEarnedAmount}</span>
      </div>
      <div className="flex justify-between items-center text-sm">
        <span className="text-gray-500">Questions Answered</span>
        <span className="text-gray-700 font-medium">{attempts?.questions?.length || 0}</span>
      </div>
    </div>
  );
};

export default PayoutSummary;
