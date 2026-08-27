import { configureStore } from '@reduxjs/toolkit';
import userProfileReducer from './userProfileSlice';
import sistersAccountsReducer from './sistersAccountsSlice';
import brothersAccountsReducer from './brothersAccountSlice';

export const store = configureStore({
  reducer: {
    userProfile: userProfileReducer,
    sistersAccounts: sistersAccountsReducer,
    brothersAccounts: brothersAccountsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
  