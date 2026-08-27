import React, { useState } from 'react';
import type { IQuizDetails, IQuizAttempts } from '../../services/quiz';

import QuizNavBar from './QuizNavBar';
import MainQuestion from './MainQuestion';
import QuizSummaryCard from './QuizSummaryCard';

interface ActiveQuizProps {
  quizDetails: IQuizDetails;
  attempts: IQuizAttempts | null;
  setAttempts: React.Dispatch<React.SetStateAction<IQuizAttempts | null>>;
}

const ActiveQuiz: React.FC<ActiveQuizProps> = ({ quizDetails, attempts, setAttempts }) => {
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const totalQuestions = quizDetails.questions.length;

  const handlePrev = () => {
    if (currentQuestionIndex > 0) setCurrentQuestionIndex(prev => prev - 1);
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) setCurrentQuestionIndex(prev => prev + 1);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 mt-6 pb-20 " >
      {/* Left side: Quiz Content */}
      <div className="flex-1 space-y-6">
        
        <QuizNavBar 
          quizDetails={quizDetails}
          attempts={attempts}
          currentQuestionIndex={currentQuestionIndex}
          setCurrentQuestionIndex={setCurrentQuestionIndex}
          handlePrev={handlePrev}
          handleNext={handleNext}
        />

        <MainQuestion 
          quizDetails={quizDetails}
          attempts={attempts}
          setAttempts={setAttempts}
          currentQuestionIndex={currentQuestionIndex}
          setCurrentQuestionIndex={setCurrentQuestionIndex}
        />

      </div>

      {/* Right side: Summary Card */}
      <div className="hidden lg:block w-80 shrink-0 sticky top-6 self-start">
        <QuizSummaryCard quizDetails={quizDetails} attempts={attempts} />
      </div>

    </div>
  );
};

export default ActiveQuiz;