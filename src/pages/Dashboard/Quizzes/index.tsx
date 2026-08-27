import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import type { SisterAccount } from '../Accounts/SisterList';
import PickSister from '../../../components/Quizzes/PickSister';
import QuizList from '../../../components/Quizzes/QuizList';
import { getQuizzesOfSister, createQuiz, deleteQuiz, type IQuiz } from '../../../services/quiz';

const Quizzes = () => {
  
  const navigate = useNavigate();
  const [selectedSister, setSelectedSister] = useState<SisterAccount | null>(null);
  
  const [quizzesList, setQuizzesList] = useState<IQuiz[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newQuizTitle, setNewQuizTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    setShowAddForm(true);
  };

  const handleSubmitQuiz = async () => {
    if (!newQuizTitle.trim() || !selectedSister) return;
    setIsSubmitting(true);
    try {
      const response = await createQuiz(newQuizTitle, selectedSister._id);
      if (response.success && response.data) {
        setQuizzesList(prev => [...prev, response.data as IQuiz]);
        setNewQuizTitle('');
        setShowAddForm(false);
      }
    } catch (error) {
      console.error('Failed to create quiz:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveQuiz = async (quiz: IQuiz) => {
    try {
      const response = await deleteQuiz(quiz._id);
      if (response.success) {
        setQuizzesList(prev => prev.filter(q => q._id !== quiz._id));
      }
    } catch (error) {
      console.error('Failed to delete quiz:', error);
    }
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
          
          {showAddForm && (
            <div className="bg-gray-50 border border-gray-200 p-6 rounded-2xl mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">Create New Quiz</h3>
                <button 
                  onClick={() => setShowAddForm(false)} 
                  className="text-gray-500 hover:text-gray-700 font-bold px-3 py-1 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Close
                </button>
              </div>
              <div className="flex gap-4 items-end">
                <div className="flex-1">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Quiz Title</label>
                  <input 
                    type="text" 
                    value={newQuizTitle} 
                    onChange={(e) => setNewQuizTitle(e.target.value)}
                    placeholder="e.g. Raksha Bandhan Special"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-rose-500 font-medium"
                  />
                </div>
                <button 
                  onClick={handleSubmitQuiz}
                  disabled={isSubmitting || !newQuizTitle.trim()}
                  className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-xl hover:-translate-y-1 transition-all shadow-md disabled:opacity-50 disabled:hover:translate-y-0"
                >
                  {isSubmitting ? 'Creating...' : 'Submit'}
                </button>
              </div>
            </div>
          )}
          
          <QuizList 
            quizzes={quizzesList} 
            loading={loading}
            onAddQuestions={handleAddQuestions}
            onResetQuiz={handleResetQuiz}
            onDeleteQuiz={handleRemoveQuiz}
          />
        </div>
      )}
    </div>
  );
};

export default Quizzes;

