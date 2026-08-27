import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { getQuizById, type IQuizDetails } from '../../../services/quiz';
import QuestionList from '../../../components/Quizzes/QuestionList';
import CreateQuestion from '../../../components/Quizzes/CreateQuestion';

const SisterQuiz = () => {

  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  const [quizDetails, setQuizDetails] = useState<IQuizDetails | null>(null);
  const [loading, setLoading] = useState(true); 

  const fetchQuiz = async () => {
    if (!quizId) return;
    setLoading(true);
    try {
      const response = await getQuizById(quizId);
      if (response.success && response.data) {
        setQuizDetails(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch quiz details:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuiz();
  }, [quizId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-rose-500"></div>
      </div>
    );
  }

  if (!quizDetails) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-700">Quiz not found</h2>
        <button 
          onClick={() => navigate('/dashboard/quizzes')}
          className="mt-4 px-4 py-2 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100"
        >
          Go Back
        </button>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto pb-20 mt-10">
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => navigate('/dashboard/quizzes')}
          className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight flex-1">
          {quizDetails.title}
        </h1>
      </div>

      <div className="flex flex-col-reverse lg:flex-row gap-8 items-start">
        
        {/* Main Content: Create Question and List */}
        <div className="flex-1 w-full">
          {/* creating a new Question comes here */}
          <CreateQuestion quizId={quizDetails._id} onSuccess={fetchQuiz} />

          {/* rendered the questions */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Questions List</h2>
            <QuestionList questions={quizDetails.questions} />
          </div>
        </div>

        {/* Sidebar: Summary */}
        <div className="w-full lg:w-80 shrink-0 sticky top-0">
          {/* summay  */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-6">
            <div>
              <p className="text-sm text-gray-500 font-medium mb-1 uppercase tracking-wider">Sister Details</p>
              <p className="font-bold text-xl text-gray-800">{quizDetails.sister.name}</p>
              <p className="text-gray-600 font-medium">{quizDetails.sister.phoneNumber}</p>
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-rose-50 p-4 rounded-xl border border-rose-100 text-center">
              <p className="text-sm text-rose-600 font-bold mb-1 uppercase tracking-wider">Total Amount</p>
              <p className="font-extrabold text-3xl text-gray-900">₹{quizDetails.totalAmount}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SisterQuiz;
