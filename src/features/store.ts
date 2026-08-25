import { configureStore } from '@reduxjs/toolkit';
import userProfileReducer from './userProfileSlice';
import sistersAccountsReducer from './sistersAccountsSlice';

export const store = configureStore({
  reducer: {
    userProfile: userProfileReducer,
    sistersAccounts: sistersAccountsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
  