import api from './api';

export interface RegisterBrotherData {
  name: string;
  phoneNumber: string;
  password: string;
  countryCode?: string;
}


export const registerBrother = async (data: RegisterBrotherData) => {
    try {
      const response = await api.post('/users/register-brother', {
        ...data,
        countryCode: data.countryCode || '+91', // default to +91 as per the backend schema
      });
      
      return response.data;
    } catch (error) {
      console.error('Error in registerBrother service:', error);
      throw error;
    }
  }

export interface LoginBrotherData {
  phoneNumber: string;
  password: string;
  countryCode?: string;
}

export interface ILoginResponse {
  success: boolean;
  data: any;
  message: string
}

export const loginBrother = async (data: LoginBrotherData): Promise<ILoginResponse> => {
  try {
    const response = await api.post('/users/login-brother', {
      ...data,
      countryCode: data.countryCode || '+91', // default to +91 as per backend schema
    });

    console.log(response.data);    
    return response.data;
  } catch (error) {
    console.error('Error in loginBrother service:', error);
    throw error;
  }
}

export const fetchUserProfile = async (): Promise<ILoginResponse> => {
  try {
    const response = await api.get('/users/profile');
    return response.data;
  } catch (error) {
    console.error('Error in fetchUserProfile service:', error);
    throw error;
  }
}

export const getSistersAccounts = async () => {
  try {
    const response = await api.get('/users/sisters');
    return response.data;
  } catch (error) {
    console.error('Error in getSistersAccounts service:', error);
    throw error;
  }
}

export interface RegisterSisterData {
  name: string;
  phoneNumber: string;
  countryCode?: string;
}

export const registerSister = async (data: RegisterSisterData) => {
  try {
    const response = await api.post('/users/register-sister', {
      ...data,
      countryCode: data.countryCode || '+91',
    });
    return response.data;
  } catch (error) {
    console.error('Error in registerSister service:', error);
    throw error;
  }
}

export const deleteSisterAccount = async (sisterId: string) => {
  try {
    const response = await api.delete(`/users/sister/${sisterId}`);
    return response.data;
  } catch (error) {
    console.error('Error in deleteSisterAccount service:', error);
    throw error;
  }
}
