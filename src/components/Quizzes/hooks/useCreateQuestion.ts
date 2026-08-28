import { useState, useRef, useEffect } from 'react';
import { addQuestionToQuiz, type QuestionLevel, type QuestionType } from '../../../services/quiz';
import type { LocalOption } from '../OptionsManager';

export const useCreateQuestion = (quizId: string, onSuccess: () => void) => {
  const [quesDesc, setQuesDesc] = useState('');
  const [questionMedia, setQuestionMedia] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [level, setLevel] = useState<QuestionLevel>('NOOB');
  const [scoreAmount, setScoreAmount] = useState<number>(5);
  const [questionType, setQuestionType] = useState<QuestionType>('MCQ');
  
  const [options, setOptions] = useState<LocalOption[]>([]);
  const [textAnswers, setTextAnswers] = useState<string[]>([]);
  const [currentTextAnswer, setCurrentTextAnswer] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const mediaInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (questionMedia) {
      const url = URL.createObjectURL(questionMedia);
      setMediaPreview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setMediaPreview(null);
    }
  }, [questionMedia]);

  const handleAddTextAnswer = () => {
    if (currentTextAnswer.trim() && !textAnswers.includes(currentTextAnswer.trim())) {
      setTextAnswers([...textAnswers, currentTextAnswer.trim()]);
      setCurrentTextAnswer('');
    }
  };

  const removeTextAnswer = (ans: string) => {
    setTextAnswers(textAnswers.filter(a => a !== ans));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!quesDesc.trim()) {
      return setError('Question description is required.');
    }

    if (questionType === 'MCQ') {
      if (options.length < 2) return setError('Please add at least 2 options for an MCQ.');
      if (!options.some(o => o.isCorrect)) return setError('Please mark at least one option as correct.');
    } else {
      if (textAnswers.length === 0) return setError('Please provide at least one acceptable text answer.');
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('quesDesc', quesDesc);
      formData.append('level', level);
      formData.append('scoreAmount', scoreAmount.toString());
      formData.append('questionType', questionType);

      if (questionMedia) {
        formData.append('questionMediaUrl', questionMedia);
      }

      if (questionType === 'MCQ') {
        const optionsListForServer: any[] = [];
        const answerListForServer: string[] = [];

        options.forEach((opt, idx) => {
          const indexStr = String(idx + 1);
          if (opt.isCorrect) {
            answerListForServer.push(indexStr);
          }

          if (opt.type === 'IMG') {
            optionsListForServer.push({ type: 'IMG', value: '' });
            formData.append(`option-img-${indexStr}`, opt.value as File);
          } else {
            optionsListForServer.push({ type: 'TEXT', value: opt.value as string });
          }
        });

        formData.append('optionsList', JSON.stringify(optionsListForServer));
        formData.append('answerList', JSON.stringify(answerListForServer));
      } else {
        formData.append('answerList', JSON.stringify(textAnswers));
      }

      await addQuestionToQuiz(quizId, formData);
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to add question');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    quesDesc, setQuesDesc,
    questionMedia, setQuestionMedia,
    mediaPreview,
    level, setLevel,
    scoreAmount, setScoreAmount,
    questionType, setQuestionType,
    options, setOptions,
    textAnswers, currentTextAnswer, setCurrentTextAnswer,
    isSubmitting, error, mediaInputRef,
    handleAddTextAnswer, removeTextAnswer, handleSubmit
  };
};
