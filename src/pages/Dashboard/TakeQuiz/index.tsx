import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../features/store';
import { createPortal } from 'react-dom';
import { SisterLoginComponent } from '../../../components/Auth/SisterLoginComponent';
import { getQuizById, getQuizAttempts } from '../../../services/quiz';
import type { IQuizDetails, IQuizAttempts } from '../../../services/quiz';
import { QuizIntro } from '../../../components/Quizzes/QuizIntro';
import ActiveQuiz from '../../../components/Quizzes/ActiveQuiz';


const TakeQuiz = () => {

  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.userProfile.profile);

  const [quizDetails, setQuizDetails] = useState<IQuizDetails | null>(null);
  const [attempts, setAttempts] = useState<IQuizAttempts | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isOpenQuiz, setIsOpenQuiz] = useState(false);

  // fetch the data 
  useEffect(() => {
    if (user && quizId) {
      const fetchQuiz = async () => {
        setLoading(true);
        setError('');
        try {
          const res = await getQuizById(quizId);
          if (res.success && res.data) {
            setQuizDetails(res.data);
          } 
          
          try {
            const attemptsRes = await getQuizAttempts(quizId);
            if (attemptsRes.success && attemptsRes.data) {
              setAttempts(attemptsRes.data);
            }
            
          } catch (attemptsErr) {
            console.error("No previous attempts found or failed to fetch attempts:", attemptsErr);
          }
        } catch (err: any) {
          setError(err.response?.data?.message || 'Failed to fetch quiz details');
        } finally {
          setLoading(false);
        }
      };
      fetchQuiz();
    }
  }, [user, quizId]);

  // If user is not logged in, render a portal with LoginComponent
  if (!user) {
    return createPortal(
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <div className="bg-white rounded-3xl p-2 relative shadow-2xl">
          <SisterLoginComponent />
        </div>
      </div>,
      document.body
    );
  }

  return (
    <div className="max-w-4xl mx-auto w-full mt-10">

      {/* navigation to quiz page */}
      <div className="mb-6">
        <button 
          onClick={() => navigate('/sisterDashboard/myquizzes')}
          className="text-gray-500 hover:text-amber-600 font-medium transition-colors flex items-center gap-2"
        >
          ← Back to Quizzes
        </button>
      </div>

      {/* conditoanlly rendering */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-6 rounded-2xl border border-red-100 text-center">
          {error}
        </div>
      ) : quizDetails ? (
        isOpenQuiz ? (
          <ActiveQuiz 
            quizDetails={quizDetails} 
            attempts={attempts} 
            setAttempts={setAttempts} 
          />
        ) : (
          <QuizIntro 
            quizDetails={quizDetails} 
            attempts={attempts}
            setIsOpenQuiz={setIsOpenQuiz} 
            setError={setError} 
          />
        )
      ) : null}
    </div>
  );
};

export default TakeQuiz;
