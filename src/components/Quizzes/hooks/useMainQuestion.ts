import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import type { IQuizDetails, IQuizAttempts } from '../../../services/quiz';
import { saveQuestionAttempt, getQuizAttempts, performQuizAction, QuizAction } from '../../../services/quiz';

export const useMainQuestion = (
  quizDetails: IQuizDetails,
  attempts: IQuizAttempts | null,
  setAttempts: React.Dispatch<React.SetStateAction<IQuizAttempts | null>>,
  currentQuestionIndex: number
) => {
  const navigate = useNavigate();
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackType, setFeedbackType] = useState<'CORRECT' | 'WRONG' | null>(null);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentQuestion = quizDetails.questions[currentQuestionIndex];
  const attempt = attempts?.questions?.find(q => q.questionId === currentQuestion._id);
  const isAttempted = Boolean(attempt);
  const isCompleted = quizDetails.status === 'COMPLETED';
  const isFrozen = isAttempted || isCompleted;

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
      
      const isCorrect = response.data?.isCorrect;
      setFeedbackType(isCorrect ? 'CORRECT' : 'WRONG');
      setShowFeedback(true);
      
      setTimeout(() => {
        setShowFeedback(false);
      }, 3000);

      const attemptsRes = await getQuizAttempts(quizDetails._id);
      if (attemptsRes && attemptsRes.data) {
        setAttempts(attemptsRes.data);
      }
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

  return {
    navigate,
    selectedAnswers, setSelectedAnswers,
    isSaving,
    showFeedback,
    feedbackType,
    showSubmitModal, setShowSubmitModal,
    isSubmitting,
    currentQuestion,
    attempt,
    isAttempted,
    isCompleted,
    isFrozen,
    handleToggleOption,
    handleSave,
    handleSubmitConfirm
  };
};
