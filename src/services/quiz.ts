import api from './api';

export type QuizStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
export type QuizState = 'DRAFT' | 'READY';

export interface IQuiz {
  _id: string;
  title: string;
  brotherId: string;
  sisterId: string;
  status: QuizStatus;
  quizState?: QuizState;
  createdAt?: string;
  updatedAt?: string;
  totalAmount?: number;
  payoutStats?: {
    pending: number;
    success: number;
    failed: number;
  };
  questions?: any[];
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

export const getQuizzesOfSister = async (userId: string, quizStates: string[] = ["READY"], quizStatuses: string[] = ['PENDING', 'IN_PROGRESS', 'COMPLETED']): Promise<ApiResponse<IQuiz[]>> => {
  const statesQuery = quizStates.join('-');
  const statusesQuery = quizStatuses.join('-');
  const response = await api.get(`/quizzes/sister/${userId}?quizStates=${statesQuery}&statuses=${statusesQuery}`);
  return response.data;
};

export const createQuiz = async (title: string, sisterId: string): Promise<ApiResponse<IQuiz>> => {
  const response = await api.post(`/quizzes`, { title, sisterId });
  return response.data;
};

export const deleteQuiz = async (quizId: string): Promise<ApiResponse<null>> => {
  const response = await api.delete(`/quizzes/quiz/${quizId}`);
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

export const QuizAction = {
  START: "START",
  SUBMIT: "SUBMIT",
  RESET: "RESET"
} as const;

export type QuizAction = typeof QuizAction[keyof typeof QuizAction];


export const performQuizAction = async (quizId: string, action: QuizAction): Promise<ApiResponse<any>> => {
  const response = await api.patch(`/quizzes/${quizId}?action=${action}`);
  return response.data;
};

export interface IAttemptQuestion {
  questionId: string;
  isCorrect: boolean;
  amountEarned: number;
  answers?: string[];
}

export interface IQuizAttempts {
  questions: IAttemptQuestion[];
  totalAmountEarned: number;
  quizId: string;
}

export const getQuizAttempts = async (quizId: string): Promise<ApiResponse<IQuizAttempts>> => {
  const response = await api.get(`/attempts/${quizId}`);
  return response.data;
};

export const saveQuestionAttempt = async (quizId: string, questionId: string, answerList: string[]): Promise<ApiResponse<any>> => {
  const response = await api.post(`/attempts/${quizId}/${questionId}`, { answerList });
  return response.data;
};
