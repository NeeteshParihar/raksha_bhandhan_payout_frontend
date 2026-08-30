import React, { useState } from 'react';
import type { IQuestion } from '../../services/quiz';
import QuestionCard from './QuestionCard';

interface QuestionListProps {
  questions: IQuestion[];
  quizId?: string;
  onDeleteSuccess?: (questionId: string) => void;
}

const QuestionList: React.FC<QuestionListProps> = ({ questions, quizId, onDeleteSuccess }) => {
  
  const [expandList, setExpandList] = useState<string[]>([]);

  const toggleExpand = (id: string) => {
    setExpandList(prev => 
      prev.includes(id) ? prev.filter(qId => qId !== id) : [...prev, id]
    );
  };

  if (!questions || questions.length === 0) {
    return (
      <div className="py-10 text-center border border-dashed border-gray-200 rounded-2xl bg-gray-50 text-gray-500">
        No questions added to this quiz yet.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {questions.map((q, index) => (
        <QuestionCard 
          key={q._id} 
          question={q} 
          index={index}
          isExpanded={expandList.includes(q._id)} 
          onToggle={() => toggleExpand(q._id)} 
          quizId={quizId}
          onDeleteSuccess={onDeleteSuccess}
        />
      ))}
    </div>
  );
};

export default QuestionList;
