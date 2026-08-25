import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import type { SisterAccount } from '../Accounts/SisterList';
import PickSister from '../../../components/Quizzes/PickSister';
import QuizList from '../../../components/Quizzes/QuizList';
import { getQuizzesOfSister, type IQuiz } from '../../../services/quiz';

const Quizzes = () => {
  
  const navigate = useNavigate();
  const [selectedSister, setSelectedSister] = useState<SisterAccount | null>(null);
  
  const [quizzesList, setQuizzesList] = useState<IQuiz[]>([]);
  const [loading, setLoading] = useState(false);

  const selectSister = (sister: SisterAccount) => {
    setSelectedSister(sister);
    localStorage.setItem('QUIZ-selectedSisterId', sister._id);
  };

  const unselectSister = () => {
    setSelectedSister(null);
    setQuizzesList([]);
    localStorage.removeItem('QUIZ-selectedSisterId');
  };

  useEffect(() => {
    if (selectedSister?._id) {
      const fetchQuizzes = async () => {
        setLoading(true);
        try {
          const response = await getQuizzesOfSister(selectedSister._id);
          if (response.success && response.data) {
            setQuizzesList(response.data);
          } else {
            setQuizzesList([]);
          }
        } catch (error) {
          console.error('Failed to fetch quizzes:', error);
          setQuizzesList([]);
        } finally {
          setLoading(false);
        }
      };
      fetchQuizzes();
    }
  }, [selectedSister?._id]);

  // Mock functions
  const handleAddQuiz = () => {
    console.log('Add quiz clicked');
  };

  const handleRemoveQuiz = (quiz: IQuiz) => {
    console.log('Remove quiz clicked', quiz);
  };

  const handleAddQuestions = (quiz: IQuiz) => {
    navigate(`/dashboard/quizzes/${quiz._id}`);
  };

  const handleResetQuiz = (quiz: IQuiz) => {
    console.log('Reset quiz clicked for quiz:', quiz);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-amber-500 tracking-tight">QUIZZES</h1>
        <p className="text-gray-500 mt-2 font-medium">Select a sister to manage and view their quizzes.</p>
      </div>

      <PickSister 
        selectedSister={selectedSister} 
        selectSister={selectSister} 
        unselectSister={unselectSister} 
      />

      {selectedSister && (
        <div className="mt-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Quizzes for {selectedSister.name}</h2>
            <button 
              onClick={handleAddQuiz}
              className="px-5 py-2.5 bg-gradient-to-r from-rose-500 to-amber-500 text-white font-bold rounded-xl shadow-sm hover:shadow-md transition-all"
            >
              + Add Quiz
            </button>
          </div>
          
          <QuizList 
            quizzes={quizzesList} 
            loading={loading}
            onAddQuestions={handleAddQuestions}
            onResetQuiz={handleResetQuiz}
          />
        </div>
      )}
    </div>
  );
};

export default Quizzes;

