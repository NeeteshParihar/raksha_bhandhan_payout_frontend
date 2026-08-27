import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import PickBrother from '../../../components/Quizzes/PickBrother';
import type { BrotherAccount } from '../../../features/brothersAccountSlice';
import { getQuizzesOfSister } from '../../../services/quiz';
import type { IQuiz } from '../../../services/quiz';
import QuizCard from '../../../components/Quizzes/QuizCard';

const SisterMyQuizzes = () => {
  const navigate = useNavigate();
  const [selectedBrother, setSelectedBrother] = useState<BrotherAccount | null>(null);
  const [quizzes, setQuizzes] = useState<IQuiz[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSelectBrother = (brother: BrotherAccount) => {
    setSelectedBrother(brother);
    localStorage.setItem('QUIZ-selectedBrotherId', brother._id);
  };

  const handleUnselectBrother = () => {
    setSelectedBrother(null);
    setQuizzes([]);
    localStorage.removeItem('QUIZ-selectedBrotherId');
  };

  useEffect(() => {
    const fetchQuizzes = async () => {
      if (!selectedBrother) return;
      
      setLoading(true);
      setError('');
      try {
        const response = await getQuizzesOfSister(selectedBrother._id);
        if (response.success && response.data) {
          setQuizzes(response.data);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load quizzes');
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, [selectedBrother]);

  const handleQuizAction = (quiz: IQuiz) => {
    navigate(`/sisterDashboard/myquizzes/quiz/${quiz._id}`);
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">My Quizzes</h1>
        <p className="text-gray-500 mt-2 text-lg">Select a brother to view the quizzes he created for you.</p>
      </div>

      <PickBrother 
        selectedBrother={selectedBrother}
        selectBrother={handleSelectBrother}
        unselectBrother={handleUnselectBrother}
        localStoragePrefix="QUIZ"
      />

      {selectedBrother && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Quizzes from {selectedBrother.name}
          </h2>
          
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-rose-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 text-red-600 p-4 rounded-2xl border border-red-100 text-center">
              {error}
            </div>
          ) : quizzes.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {quizzes.map((quiz) => (
                <QuizCard 
                  key={quiz._id} 
                  quiz={quiz} 
                  userRole="SISTER" 
                  onSisterAction={handleQuizAction}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white/80 backdrop-blur-md p-10 rounded-3xl border border-white shadow-sm text-center">
              <span className="text-6xl mb-4 block">📭</span>
              <h3 className="text-xl font-bold text-gray-800 mb-2">No Quizzes Found</h3>
              <p className="text-gray-500">
                It looks like {selectedBrother.name} hasn't created any quizzes for you yet.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SisterMyQuizzes;
