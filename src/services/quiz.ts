import api from './api';

export type QuizStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';

export interface IQuiz {
  _id: string;
  title: string;
  brotherId: string;
  sisterId: string;
  status: QuizStatus;
  createdAt?: string;
  updatedAt?: string;
}

export type OptionType = 'IMG' | 'TEXT';
export type QuestionType = 'MCQ' | 'TEXT';
export type QuestionLevel = 'NOOB' | 'PRO' | 'LEGEND';

export interface IOption {
  _id: string;
  type: OptionType;
  value: string;
  publicId?: string;
}

export interface IQuestion {
  _id: string;
  quesDesc: string;
  questionMediaUrl?: string;
  questionMediaId?: string;
  questionType: QuestionType;
  optionsList?: IOption[];
  answerList: string[];
  level: QuestionLevel;
  scoreAmount: number;
}

export interface IQuizDetails extends Omit<IQuiz, 'sisterId'> {
  sister: {
    _id: string;
    phoneNumber: string;
    countryCode: string;
    name: string;
    role: string;
    brotherId: string;
  };
  questions: IQuestion[];
  totalScore: number;
}


interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

export const getQuizzesOfSister = async (sisterId: string): Promise<ApiResponse<IQuiz[]>> => {
  const response = await api.get(`/quizzes/sister/${sisterId}`);
  return response.data;
};

export const getQuizById = async (quizId: string): Promise<ApiResponse<IQuizDetails>> => {
  const response = await api.get(`/quizzes/${quizId}`);
  return response.data;
};

export const addQuestionToQuiz = async (quizId: string, formData: FormData): Promise<ApiResponse<IQuestion>> => {
  const response = await api.post(`/quizzes/${quizId}/question`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

