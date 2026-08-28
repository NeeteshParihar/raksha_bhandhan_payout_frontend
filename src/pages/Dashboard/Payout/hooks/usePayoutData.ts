import { useState, useEffect } from 'react';
import { getPayoutByQuiz, PayoutStatus, type IPayout } from '../../../../services/payout';
import { getQuizById, getQuizAttempts, type IQuizDetails, type IQuizAttempts } from '../../../../services/quiz';

export const usePayoutData = (quizId: string | undefined) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [payout, setPayout] = useState<IPayout | null>(null);
  const [quizDetails, setQuizDetails] = useState<IQuizDetails | null>(null);
  const [attempts, setAttempts] = useState<IQuizAttempts | null>(null);

  useEffect(() => {
    if (!quizId) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch Quiz & Attempts concurrently
        const [quizRes, attemptsRes] = await Promise.all([
          getQuizById(quizId).catch(() => null),
          getQuizAttempts(quizId).catch(() => null)
        ]);

        if (quizRes?.success && quizRes.data) {
          setQuizDetails(quizRes.data);
        }
        if (attemptsRes?.success && attemptsRes.data) {
          setAttempts(attemptsRes.data);
        }

        // Fetch Payout
        try {
          const successPayoutRes = await getPayoutByQuiz(quizId, PayoutStatus.SUCCESS);
          if (successPayoutRes.success && successPayoutRes.data) {
            setPayout(successPayoutRes.data);
            return;
          }
        } catch {
          // Ignore, continue to pending
        }

        try {
          const pendingPayoutRes = await getPayoutByQuiz(quizId, PayoutStatus.PENDING);
          if (pendingPayoutRes.success && pendingPayoutRes.data) {
            setPayout(pendingPayoutRes.data);
          }
        } catch {
          // Ignore, no payout found
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to load data';
        setError(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [quizId]);

  return {
    loading,
    error,
    payout,
    setPayout,
    quizDetails,
    attempts,
  };
};
