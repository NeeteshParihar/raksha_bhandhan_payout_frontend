import React from 'react';
import type { IQuizDetails, IQuizAttempts } from '../../services/quiz';

interface QuizNavBarProps {
  quizDetails: IQuizDetails;
  attempts: IQuizAttempts | null;
  currentQuestionIndex: number;
  setCurrentQuestionIndex: React.Dispatch<React.SetStateAction<number>>;
  handlePrev: () => void;
  handleNext: () => void;
}

const QuizNavBar: React.FC<QuizNavBarProps> = ({
  quizDetails,
  attempts,
  currentQuestionIndex,
  setCurrentQuestionIndex,
  handlePrev,
  handleNext
}) => {
  const totalQuestions = quizDetails.questions.length;

  return (
    <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between gap-4">
      <div className="flex flex-1 gap-2 overflow-x-auto items-center py-2 px-2">
        {quizDetails.questions.map((q, idx) => {
          const attempt = attempts?.questions?.find(aq => aq.questionId === q._id);
          let bgColor = "bg-gray-200";
          if (idx === currentQuestionIndex) bgColor = "bg-amber-600 shadow-sm";
          else if (attempt) {
            bgColor = attempt.isCorrect ? "bg-green-300" : "bg-red-300";
          }
          return (
            <div 
              key={q._id} 
              onClick={() => setCurrentQuestionIndex(idx)}
              className={`h-2.5 flex-1 rounded-full min-w-[32px] cursor-pointer transition-all hover:opacity-80 ${bgColor}`} 
              title={`Question ${idx + 1}`} 
            />
          );
        })}
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <button onClick={handlePrev} disabled={currentQuestionIndex === 0} className="p-3 bg-gray-50 rounded-xl border border-gray-200 disabled:opacity-50 hover:bg-gray-100 transition-colors">
          ⬅️
        </button>
        <button onClick={handleNext} disabled={currentQuestionIndex === totalQuestions - 1} className="p-3 bg-gray-50 rounded-xl border border-gray-200 disabled:opacity-50 hover:bg-gray-100 transition-colors">
          ➡️
        </button>
      </div>
    </div>
  );
};

export default QuizNavBar;
