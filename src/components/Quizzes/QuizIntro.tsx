import React, { useState } from 'react';
import type { IQuizDetails, IQuizAttempts } from '../../services/quiz';
import { performQuizAction, QuizAction } from '../../services/quiz';

interface QuizIntroProps {
  quizDetails: IQuizDetails;
  attempts?: IQuizAttempts | null;
  setIsOpenQuiz: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<string>>;
}

export const QuizIntro: React.FC<QuizIntroProps> = ({ quizDetails, attempts, setIsOpenQuiz, setError }) => {
  const [actionLoading, setActionLoading] = useState(false);

  const handleQuizAction = async () => {
    setActionLoading(true);
    
    if (quizDetails.status === 'COMPLETED' || quizDetails.status === 'IN_PROGRESS') {
      setIsOpenQuiz(true);
      setActionLoading(false);
      return;
    }

    try {
      await performQuizAction(quizDetails._id, QuizAction.START);
      setIsOpenQuiz(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to start quiz');
    } finally {
      setActionLoading(false);
    }
  };
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
    <div className="space-y-6 mb-10">
      {/* Top Box: Brother & Quiz Details */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 justify-between items-start">
        
        {/* Brother Details */}
        <div className="flex-1">
          <p className="text-sm text-gray-500 font-medium mb-1 uppercase tracking-wider">Created By Brother</p>
          <p className="font-bold text-xl text-gray-800">{(quizDetails as any).brother?.name || 'Brother Name'}</p>
          <p className="text-gray-600 font-medium">{(quizDetails as any).brother?.phoneNumber || ''}</p>
        </div>
        
        {/* Quiz Details */}
        <div className="flex-1 md:text-right bg-gradient-to-br from-amber-50 to-rose-50 p-4 rounded-xl border border-rose-100">
          <h3 className="text-lg font-bold text-gray-800">{quizDetails.title}</h3>
          <div className="mt-2 flex flex-wrap md:justify-end items-center gap-2">
            <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(quizDetails.status)}`}>
              {quizDetails.status.replace('_', ' ')}
            </span>
            <span className="text-sm font-bold text-gray-900 bg-white px-2 py-1 rounded-md border border-gray-200">
              Total: ₹{quizDetails.totalAmount || 0}
            </span>
          </div>
        </div>
      </div>

      {/* Middle Box: Instructions */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 min-h-[200px]">
        <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Instructions</h3>
        {quizDetails.status === 'COMPLETED' ? (
          <div className="text-green-700 bg-green-50 p-4 rounded-xl border border-green-100">
            <p className="font-medium text-lg text-center">🎉 You have successfully completed this quiz!</p>
            <p className="text-center mt-2 text-sm">Review your answers and see how you did.</p>
          </div>
        ) : (
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            <li>Please answer all the questions carefully.</li>
            <li>Once you start, your progress will be saved.</li>
            <li>You will earn rewards for correct answers based on the amount set by your brother.</li>
            <li>Have fun and good luck!</li>
          </ul>
        )}
      </div>


      {/* Questions Grid Box */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Questions Overview</h3>
        <div className="flex flex-wrap gap-3">
          {quizDetails.questions.map((q, index) => {
            const attempt = attempts?.questions?.find((aq) => aq.questionId === q._id);
            let bgColor = "bg-white border-gray-200 text-gray-700 shadow-sm";
            if (attempt) {
              if (attempt.isCorrect) bgColor = "bg-green-100 border-green-300 text-green-700";
              else bgColor = "bg-red-100 border-red-300 text-red-700";
            }
            return (
              <div 
                key={q._id} 
                className={`w-12 h-12 flex items-center justify-center rounded-xl border-2 font-bold text-lg ${bgColor}`}
                title={`Question ${index + 1}`}
              >
                {index + 1}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Box: Action Button */}
      <div className="flex justify-center pt-4">
        <button 
          onClick={handleQuizAction}
          disabled={actionLoading}
          className={`px-10 py-4 rounded-2xl font-bold text-lg transition-all shadow-lg text-white disabled:opacity-50 ${
            quizDetails.status === 'PENDING'
              ? 'bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 hover:-translate-y-1'
              : quizDetails.status === 'IN_PROGRESS'
              ? 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 hover:-translate-y-1'
              : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 hover:-translate-y-1'
          }`}
        >
          {actionLoading ? 'Loading...' : quizDetails.status === 'PENDING' ? 'Start Quiz' : quizDetails.status === 'IN_PROGRESS' ? 'Continue Quiz' : 'Review Quiz'}
        </button>
      </div>
    </div>
  );
};
