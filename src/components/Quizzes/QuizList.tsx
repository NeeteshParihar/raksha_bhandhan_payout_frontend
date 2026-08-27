import React from 'react';
import type { IQuiz } from '../../services/quiz';
import QuizCard from './QuizCard';

interface QuizListProps {
  quizzes: IQuiz[];
  loading: boolean;
  onAddQuestions: (quiz: IQuiz) => void;
  onResetQuiz: (quiz: IQuiz) => void;
  onDeleteQuiz: (quiz: IQuiz) => void;
}

const QuizList: React.FC<QuizListProps> = ({ quizzes, loading, onAddQuestions, onResetQuiz, onDeleteQuiz }) => {
  if (loading) {
    return (
      <div className="bg-white/80 backdrop-blur-md p-6 rounded-3xl shadow-sm border border-white flex justify-center py-10">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500"></div>
      </div>
    );
  }

  if (quizzes.length === 0) {
    return (
      <div className="bg-white/80 backdrop-blur-md p-6 rounded-3xl shadow-sm border border-white">
        <p className="text-gray-500 text-center py-10 font-medium border border-dashed border-gray-200 rounded-2xl bg-gray-50">
          No quizzes found for this sister. Click "+ Add Quiz" to create one.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-md p-6 rounded-3xl shadow-sm border border-white space-y-4">
      {quizzes.map((quiz) => (
        <QuizCard
          key={quiz._id}
          quiz={quiz}
          onAddQuestions={onAddQuestions}
          onResetQuiz={onResetQuiz}
          onDeleteQuiz={onDeleteQuiz}
        />
      ))}
    </div>
  );
};

export default QuizList;
