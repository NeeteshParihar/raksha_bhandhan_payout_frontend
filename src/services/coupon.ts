import api from './api';

export type CouponStatus = 'UNUSED' | 'APPLIED';

export interface ICoupon {
  _id: string;
  couponCode: string;
  amount: number;
  status: CouponStatus;
  expiry?: string;
  brotherId: string;
  sisterId: string;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

// coupons/sister/6a8842478581ffdcbc6957ef
export const getCouponsOfSister = async (sisterId: string): Promise<ApiResponse<ICoupon[]>> => {
  const response = await api.get(`/coupons/sister/${sisterId}`);
  return response.data;
};

export const createCoupon = async (sisterId: string, amount: number, expiry?: Date): Promise<ApiResponse<ICoupon>> => {
  const response = await api.post(`/coupons`, {
    sisterId,
    amount,
    expiry: expiry ? expiry.toISOString() : undefined,
  });
  return response.data;
};

export const deleteCoupon = async (couponId: string): Promise<ApiResponse<null>> => {
  const response = await api.delete(`/coupons/${couponId}`);
  return response.data;
};
