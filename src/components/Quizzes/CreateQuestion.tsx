import React, { useState, useRef, useEffect } from 'react';
import { addQuestionToQuiz, type QuestionLevel, type QuestionType } from '../../services/quiz';
import OptionsManager, { type LocalOption } from './OptionsManager';
import { Upload, X, Save, AlertCircle } from 'lucide-react';

interface CreateQuestionProps {
  quizId: string;
  onSuccess: () => void;
}

const CreateQuestion: React.FC<CreateQuestionProps> = ({ quizId, onSuccess }) => {
  
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

      const response = await addQuestionToQuiz(quizId, formData);
      if (response.success) {
        // Reset form completely
        setQuesDesc('');
        setQuestionMedia(null);
        if (mediaInputRef.current) mediaInputRef.current.value = '';
        setLevel('NOOB');
        setScoreAmount(5);
        setQuestionType('MCQ');
        setOptions([]);
        setTextAnswers([]);
        onSuccess();
      } else {
        setError(response.message || 'Failed to add question');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'An error occurred while adding the question');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mb-10">
      <div className="mb-6 border-b border-gray-100 pb-4">
        <h3 className="text-2xl font-bold text-gray-800">Create New Question</h3>
        <p className="text-gray-500 mt-1 font-medium">Add a new question to this quiz.</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl flex items-center gap-3">
          <AlertCircle size={20} />
          <span className="font-bold">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Question Description</label>
            <textarea
              required
              rows={3}
              value={quesDesc}
              onChange={(e) => setQuesDesc(e.target.value)}
              placeholder="E.g., Which one is your favorite brother?"
              className="w-full p-4 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-400 font-medium text-gray-800 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Question Type</label>
            <select
              value={questionType}
              onChange={(e) => setQuestionType(e.target.value as QuestionType)}
              className="w-full p-4 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-400 font-bold text-gray-700 transition-colors"
            >
              <option value="MCQ">Multiple Choice (MCQ)</option>
              <option value="TEXT">Text Answer</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Level</label>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value as QuestionLevel)}
              className="w-full p-4 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-400 font-bold text-gray-700 transition-colors"
            >
              <option value="NOOB">NOOB</option>
              <option value="PRO">PRO</option>
              <option value="LEGEND">LEGEND</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Score Amount (₹)</label>
            <input
              type="number"
              min="0"
              required
              value={scoreAmount}
              onChange={(e) => setScoreAmount(Number(e.target.value))}
              className="w-full p-4 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-400 font-bold text-gray-700 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Question Media (Optional)</label>
            <div className="flex gap-4 items-center">
              <label className="cursor-pointer px-4 py-4 border border-gray-200 rounded-xl bg-gray-50 hover:bg-gray-100 flex items-center gap-2 text-gray-600 font-semibold transition-colors w-full">
                <Upload size={20} />
                <span className="truncate">{questionMedia ? questionMedia.name : 'Upload Image'}</span>
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/jpg, image/webp"
                  ref={mediaInputRef}
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      setQuestionMedia(e.target.files[0]);
                    }
                  }}
                />
              </label>
              {questionMedia && (
                <button
                  type="button"
                  onClick={() => {
                    setQuestionMedia(null);
                    if (mediaInputRef.current) mediaInputRef.current.value = '';
                  }}
                  className="p-4 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-100 transition-colors shrink-0"
                >
                  <X size={20} />
                </button>
              )}
            </div>
            {mediaPreview && (
              <div className="mt-4 border border-gray-200 rounded-xl overflow-hidden bg-gray-50 p-2">
                <img src={mediaPreview} alt="Preview" className="h-32 w-auto object-contain rounded-lg mx-auto" />
              </div>
            )}
          </div>
        </div>

        <div className="pt-6 border-t border-gray-100">
          <label className="block text-sm font-bold text-gray-700 mb-4 uppercase tracking-wider">
            {questionType === 'MCQ' ? 'Options & Correct Answers' : 'Acceptable Answers'}
          </label>
          
          {questionType === 'MCQ' ? (
            <OptionsManager options={options} setOptions={setOptions} />
          ) : (
            <div className="space-y-4">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={currentTextAnswer}
                  onChange={(e) => setCurrentTextAnswer(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTextAnswer();
                    }
                  }}
                  placeholder="Enter a possible correct answer..."
                  className="flex-1 p-4 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-400 font-medium text-gray-700"
                />
                <button
                  type="button"
                  onClick={handleAddTextAnswer}
                  className="px-6 py-4 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-colors"
                >
                  Add
                </button>
              </div>
              {textAnswers.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {textAnswers.map((ans, i) => (
                    <div key={i} className="px-4 py-2 bg-green-50 text-green-700 border border-green-200 rounded-lg font-bold flex items-center gap-2 shadow-sm">
                      {ans}
                      <button type="button" onClick={() => removeTextAnswer(ans)} className="hover:text-rose-600 bg-white/50 rounded-full p-1 ml-1">
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="pt-6 flex justify-end border-t border-gray-100">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-4 bg-gradient-to-r from-rose-500 to-amber-500 text-white font-extrabold rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center gap-2 disabled:opacity-70 text-lg"
          >
            {isSubmitting ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <Save size={24} />
            )}
            {isSubmitting ? 'Saving...' : 'Save Question'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateQuestion;
