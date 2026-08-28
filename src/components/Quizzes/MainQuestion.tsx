import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { createPortal } from 'react-dom';
import type { IQuizDetails, IQuizAttempts } from '../../services/quiz';
import { saveQuestionAttempt, getQuizAttempts, performQuizAction, QuizAction } from '../../services/quiz';
import QuizSummaryCard from './QuizSummaryCard';

interface MainQuestionProps {
  quizDetails: IQuizDetails;
  attempts: IQuizAttempts | null;
  setAttempts: React.Dispatch<React.SetStateAction<IQuizAttempts | null>>;
  currentQuestionIndex: number;
  setCurrentQuestionIndex: React.Dispatch<React.SetStateAction<number>>;
}

const MainQuestion: React.FC<MainQuestionProps> = ({
  quizDetails,
  attempts,
  setAttempts,
  currentQuestionIndex,
  // setCurrentQuestionIndex
}) => {
  const navigate = useNavigate();
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackType, setFeedbackType] = useState<'CORRECT' | 'WRONG' | null>(null);
  // this creates a portal on window to display summay and a confirm submit button
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentQuestion = quizDetails.questions[currentQuestionIndex];
  const attempt = attempts?.questions?.find(q => q.questionId === currentQuestion._id);
  const isAttempted = Boolean(attempt);
  const isCompleted = quizDetails.status === 'COMPLETED';
  const isFrozen = isAttempted || isCompleted;

  // Reset selected answers when question changes or prepopulate if already attempted
  useEffect(() => {
    if (attempt && attempt.answers) {
      setSelectedAnswers(attempt.answers);
    } else {
      setSelectedAnswers([]);
    }
  }, [currentQuestionIndex, attempts, currentQuestion._id, attempt]);

  const handleToggleOption = (indexStr: string) => {
    setSelectedAnswers(prev => 
      prev.includes(indexStr) ? prev.filter(a => a !== indexStr) : [...prev, indexStr]
    );
  };

  const handleSave = async () => {
    if (isCompleted) return;
    if (selectedAnswers.length === 0) return;
    setIsSaving(true);
    try {
      const response = await saveQuestionAttempt(quizDetails._id, currentQuestion._id, selectedAnswers);
      
      // Determine if correct from response and show feedback
      const isCorrect = response.data?.isCorrect;
      setFeedbackType(isCorrect ? 'CORRECT' : 'WRONG');
      setShowFeedback(true);
      
      // Reset feedback overlay after 2 seconds
      setTimeout(() => {
        setShowFeedback(false);
      }, 3000);

      const attemptsRes = await getQuizAttempts(quizDetails._id);
      if (attemptsRes && attemptsRes.data) {
        setAttempts(attemptsRes.data);
      }
      
      // Removed auto-increment so the user stays on the question to see feedback
    } catch (err) {
      console.error("Failed to save attempt", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmitConfirm = async () => {
    setIsSubmitting(true);
    try {
      await performQuizAction(quizDetails._id, QuizAction.SUBMIT);
      navigate(`/sisterDashboard/myquizzes/quiz/${quizDetails._id}/payout`);
    } catch (error) {
      console.error("Failed to submit quiz", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="bg-white p-4 sm:p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
        <div className="mb-6">
          <p className="text-xl font-medium text-gray-800 leading-relaxed">{currentQuestion.quesDesc}</p>
        </div>

        {currentQuestion.questionMediaUrl && (
          <div className="mb-6 rounded-2xl overflow-hidden border border-gray-100 max-h-[300px] flex items-center justify-center bg-gray-50 p-2">
            <img src={currentQuestion.questionMediaUrl} alt="Question Media" className="max-w-full max-h-[280px] object-contain rounded-xl" />
          </div>
        )}

        <div className="flex flex-wrap gap-3 justify-between items-center bg-amber-50 px-5 py-3 rounded-2xl border border-amber-100 mb-6">
          <div className="flex gap-4 items-center">
            <span className="text-sm font-bold text-amber-800 uppercase tracking-wide">Level: {currentQuestion.level}</span>
            <span className="font-bold text-amber-600 bg-white px-4 py-2 rounded-xl shadow-sm">Reward: ₹{currentQuestion.scoreAmount}</span>
          </div>
          {isAttempted && (
            <span className="px-3 py-1 bg-gray-200 text-gray-700 font-bold text-xs rounded-lg uppercase tracking-wider">
              Already Attempted
            </span>
          )}
        </div>

        {/* Options */}
        <div className="space-y-4 mb-8">
          {currentQuestion.questionType === 'MCQ' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentQuestion.optionsList?.map((opt, idx) => {
                const idxStr = String(idx + 1);
                const isSelected = selectedAnswers.includes(idxStr);
                return (
                  <div 
                    key={opt._id} 
                    onClick={() => !isFrozen && handleToggleOption(idxStr)}
                    className={`p-4 rounded-2xl border-2 transition-all ${isSelected ? 'border-amber-500 bg-amber-50 text-amber-900 shadow-sm' : 'border-gray-100'} ${isFrozen ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:border-gray-200 hover:bg-gray-50'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 shrink-0 rounded flex items-center justify-center border ${isSelected ? 'bg-amber-500 border-amber-500 text-white' : 'border-gray-300'}`}>
                        {isSelected && <span className="text-sm">✓</span>}
                      </div>
                      <span className="font-medium text-gray-700">{opt.type === 'TEXT' ? opt.value : 'Image Option'}</span>
                    </div>
                    {opt.type === 'IMG' && opt.value && (
                      <div className="mt-3 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 flex items-center justify-center">
                        <img src={opt.value} alt="Option" className="max-w-full h-32 object-contain rounded-xl" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <textarea 
              rows={4}
              disabled={isFrozen}
              className={`w-full p-4 rounded-2xl border-2 focus:outline-none focus:border-amber-500 font-medium text-lg transition-colors ${isFrozen ? 'bg-gray-200 border-gray-300 text-gray-500 cursor-not-allowed' : 'bg-gray-50 border-gray-200 text-gray-700'}`}
              placeholder={isFrozen ? (isAttempted ? "You have already attempted this question." : "Quiz is already completed.") : "Enter your answer here..."}
              value={selectedAnswers[0] || ''}
              onChange={(e) => setSelectedAnswers([e.target.value])}
            />
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 border-t border-gray-100 pt-6 justify-end mt-4">
          <button 
            onClick={handleSave}
            disabled={isFrozen || isSaving || selectedAnswers.length === 0}
            className="w-full sm:w-auto px-8 py-4 sm:py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 hover:-translate-y-1 text-lg sm:text-base"
          >
            {isSaving ? 'Saving...' : 'Save Answer'}
          </button>
          {quizDetails.status === 'COMPLETED' ? (
            <button 
              onClick={() => navigate(`/sisterDashboard/myquizzes/quiz/${quizDetails._id}/payout`)}
              className="w-full sm:w-auto px-8 py-4 sm:py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-xl hover:-translate-y-1 transition-all shadow-md hover:shadow-lg text-lg sm:text-base"
            >
              Go to Payout
            </button>
          ) : (
            <button 
              onClick={() => setShowSubmitModal(true)}
              className="w-full sm:w-auto px-8 py-4 sm:py-3 bg-gradient-to-r from-amber-500 to-rose-500 text-white font-bold rounded-xl hover:-translate-y-1 transition-all shadow-md hover:shadow-lg text-lg sm:text-base"
            >
              Submit Quiz
            </button>
          )}
        </div>
      </div>

      {/* Submit Modal */}
      {showSubmitModal && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-6 relative shadow-2xl max-w-md w-full">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Submit Quiz?</h2>
            
            <div className="mb-8 flex justify-center">
               <div className="w-full pointer-events-none">
                 <QuizSummaryCard quizDetails={quizDetails} attempts={attempts} />
               </div>
            </div>

            <p className="text-center text-gray-600 mb-6 font-medium">Are you sure you want to submit the quiz? You won't be able to change your answers later.</p>

            <div className="flex gap-4">
              <button 
                onClick={() => setShowSubmitModal(false)}
                disabled={isSubmitting}
                className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSubmitConfirm}
                disabled={isSubmitting}
                className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-rose-500 text-white font-bold rounded-xl shadow-md disabled:opacity-50 flex justify-center items-center"
              >
                {isSubmitting ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : 'Confirm Submit'}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Funny Feedback Overlay */}
      {createPortal(
        <div 
          className={`fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 transition-opacity duration-300 ${
            showFeedback ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          {feedbackType === 'CORRECT' ? (
            <div className="bg-gradient-to-b from-green-50 to-emerald-100 p-10 rounded-[3rem] shadow-2xl flex flex-col items-center animate-bounce border-4 border-green-400 max-w-sm w-full transform scale-110">
              <div className="text-[100px] leading-none mb-4 drop-shadow-xl">🥳</div>
              <h2 className="text-4xl font-black text-green-600 mb-2 uppercase tracking-widest text-center drop-shadow-sm">Correct!</h2>
              <p className="text-xl text-green-700 font-bold text-center bg-green-200/50 px-4 py-2 rounded-xl mt-2">
                Nailed it! +₹{currentQuestion.scoreAmount}
              </p>
            </div>
          ) : feedbackType === 'WRONG' ? (
            <div className="bg-gradient-to-b from-red-50 to-rose-100 p-10 rounded-[3rem] shadow-2xl flex flex-col items-center animate-pulse border-4 border-rose-400 max-w-sm w-full">
              <div className="text-[100px] leading-none mb-4 drop-shadow-xl grayscale-[0.2]">😭</div>
              <h2 className="text-4xl font-black text-rose-600 mb-2 uppercase tracking-widest text-center drop-shadow-sm">Oh no!</h2>
              <p className="text-xl text-rose-700 font-bold text-center bg-rose-200/50 px-4 py-2 rounded-xl mt-2">
                Better luck next time! 💔
              </p>
            </div>
          ) : null}
        </div>,
        document.body
      )}
    </>
  );
};

export default MainQuestion;
