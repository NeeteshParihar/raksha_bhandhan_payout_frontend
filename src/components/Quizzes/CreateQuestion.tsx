import React, { useState } from 'react';
import OptionsManager from './OptionsManager';
import { Upload, X, Save, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useCreateQuestion } from './hooks/useCreateQuestion';
import { updateQuizState, type QuizState } from '../../services/quiz';

interface CreateQuestionProps {
  quizId: string;
  quizState: QuizState;
  hasQuestions: boolean;
  onSuccess: () => void;
  onStateUpdate: (newState: QuizState) => void;
}

const CreateQuestion: React.FC<CreateQuestionProps> = ({ quizId, quizState, hasQuestions, onSuccess, onStateUpdate }) => {
  const [isUpdatingState, setIsUpdatingState] = useState(false);
  const [updateStateError, setUpdateStateError] = useState('');

  const handleToggleState = async () => {
    setIsUpdatingState(true);
    setUpdateStateError('');
    try {
      const newState = quizState === 'DRAFT' ? 'READY' : 'DRAFT';
      await updateQuizState(quizId, newState as QuizState);
      onStateUpdate(newState as QuizState);
    } catch (err: any) {
      console.error(err);
      setUpdateStateError(err?.response?.data?.message || 'Failed to update state');
      setTimeout(() => {
        setUpdateStateError('');
      }, 3000);
    } finally {
      setIsUpdatingState(false);
    }
  };

  const {
    quesDesc, setQuesDesc,
    questionMedia: _, setQuestionMedia,
    mediaPreview,
    level, setLevel,
    scoreAmount, setScoreAmount,
    questionType, setQuestionType,
    options, setOptions,
    textAnswers, currentTextAnswer, setCurrentTextAnswer,
    isSubmitting, error, mediaInputRef,
    handleAddTextAnswer, removeTextAnswer, handleSubmit
  } = useCreateQuestion(quizId, onSuccess);

  return (
    <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
        <h3 className="text-xl font-bold text-gray-800">Add New Question</h3>
        <div className="flex items-center gap-4">
          {updateStateError && (
            <span className="text-sm font-medium text-red-500 animate-in fade-in">
              {updateStateError}
            </span>
          )}
          {hasQuestions && (
            <button
              type="button"
              onClick={handleToggleState}
              disabled={isUpdatingState}
              title={quizState === 'DRAFT' ? 'Click to mark quiz as Ready' : 'Click to mark quiz as Draft'}
              className={`px-4 py-2 font-bold rounded-xl flex items-center gap-2 shadow-sm text-sm transition-colors ${
                quizState === 'DRAFT' 
                  ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' 
                  : 'bg-green-100 text-green-700 hover:bg-green-200'
              }`}
            >
              {isUpdatingState ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
              ) : quizState === 'DRAFT' ? (
                'Draft'
              ) : (
                <><CheckCircle2 size={16} /> Ready</>
              )}
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl flex items-center gap-3">
          <AlertCircle size={20} className="shrink-0" />
          <span className="font-medium text-sm">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Basic Settings Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Difficulty</label>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value as any)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-rose-400 font-medium text-gray-700"
            >
              <option value="NOOB">Noob</option>
              <option value="INTERMEDIATE">Intermediate</option>
              <option value="PRO">Pro</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Score</label>
            <input
              type="number"
              min={1}
              value={scoreAmount}
              onChange={(e) => setScoreAmount(Number(e.target.value))}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-rose-400 font-medium text-gray-700"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Type</label>
            <select
              value={questionType}
              onChange={(e) => setQuestionType(e.target.value as any)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-rose-400 font-medium text-gray-700"
            >
              <option value="MCQ">Multiple Choice</option>
              <option value="TEXT">Text Answer</option>
            </select>
          </div>
        </div>

        {/* Question Text */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Question Description</label>
          <textarea
            value={quesDesc}
            onChange={(e) => setQuesDesc(e.target.value)}
            placeholder="Type your question here..."
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-400 min-h-[100px] resize-y font-medium text-gray-700"
          />
        </div>

        {/* Question Media */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Add Media (Optional)</label>
          {mediaPreview ? (
            <div className="relative inline-block">
              <img src={mediaPreview} alt="Preview" className="h-40 rounded-xl object-cover border border-gray-200 shadow-sm" />
              <button
                type="button"
                onClick={() => {
                  setQuestionMedia(null);
                  if (mediaInputRef.current) mediaInputRef.current.value = '';
                }}
                className="absolute -top-3 -right-3 bg-rose-500 text-white rounded-full p-1.5 shadow-md hover:bg-rose-600 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <div 
              onClick={() => mediaInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 rounded-2xl p-6 flex flex-col items-center justify-center text-gray-500 hover:border-rose-400 hover:bg-rose-50/50 cursor-pointer transition-all"
            >
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3 text-gray-400">
                <Upload size={24} />
              </div>
              <p className="font-medium">Click to upload image</p>
              <p className="text-xs text-gray-400 mt-1">JPEG, PNG up to 5MB</p>
            </div>
          )}
          <input
            type="file"
            accept="image/jpeg, image/png"
            className="hidden"
            ref={mediaInputRef}
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setQuestionMedia(e.target.files[0]);
              }
            }}
          />
        </div>

        {/* Answers Section */}
        <div className="pt-4 border-t border-gray-100">
          <label className="block text-sm font-bold text-gray-700 mb-4">Answers</label>
          
          {questionType === 'MCQ' ? (
            <OptionsManager options={options} setOptions={setOptions} />
          ) : (
            <div className="space-y-4">
              <div className="flex gap-2">
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
                  placeholder="Type an acceptable answer"
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-400 font-medium text-gray-700"
                />
                <button
                  type="button"
                  onClick={handleAddTextAnswer}
                  className="px-6 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-colors"
                >
                  Add
                </button>
              </div>
              
              {textAnswers.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {textAnswers.map((ans, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-amber-50 text-amber-700 px-4 py-2 rounded-lg border border-amber-200 font-medium text-sm">
                      <span>{ans}</span>
                      <button
                        type="button"
                        onClick={() => removeTextAnswer(ans)}
                        className="text-amber-500 hover:text-amber-700"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Submit */}
        <div className="pt-6 flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3.5 bg-gradient-to-r from-rose-500 to-amber-500 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70 min-w-[200px]"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <Save size={20} />
                Save Question
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateQuestion;
