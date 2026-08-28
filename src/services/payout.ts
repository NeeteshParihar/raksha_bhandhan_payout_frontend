import api from './api';

export const PayoutStatus = {
  PENDING: 'PENDING',
  SUCCESS: 'SUCCESS',
  FAILED: 'FAILED',
} as const;

export type PayoutStatus = typeof PayoutStatus[keyof typeof PayoutStatus];

export interface IUserInfo {
  _id: string;
  phoneNumber: string;
  countryCode: string;
  name: string;
  role: string;
}

export interface IPayout {
  _id: string;
  brotherId: string;
  sisterId: string;
  quizId: string;
  upiId?: string;
  totalAmount: number;
  couponAmount: number;
  quizAmount: number;
  status: PayoutStatus;
  createdAt: string;
  updatedAt: string;
  __v?: number;
  sister?: IUserInfo;
  brother?: IUserInfo;
}

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

export const getPayoutByQuiz = async (quizId: string, status?: PayoutStatus): Promise<ApiResponse<IPayout>> => {
  const url = status ? `/payouts/${quizId}?status=${status}` : `/payouts/${quizId}`;
  const response = await api.get(url);
  return response.data;
};

export const requestPayout = async (quizId: string, data: { couponCode?: string; upiId: string }): Promise<ApiResponse<IPayout>> => {
  const response = await api.post(`/payouts/${quizId}`, data);
  return response.data;
};

export const getPayoutById = async (payoutId: string): Promise<ApiResponse<IPayout>> => {
  const response = await api.get(`/payouts/payout/${payoutId}`);
  return response.data;
};

export const updatePayoutStatus = async (payoutId: string, status: PayoutStatus): Promise<ApiResponse<IPayout>> => {
  const response = await api.patch(`/payouts/${payoutId}/status`, { status });
  return response.data;
};

