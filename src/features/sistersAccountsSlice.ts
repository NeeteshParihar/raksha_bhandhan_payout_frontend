import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { SisterAccount } from '../pages/Dashboard/Accounts/SisterList';

interface SistersAccountsState {
  accounts: SisterAccount[] | null;
}

const initialState: SistersAccountsState = {
  accounts: null,
};

const sistersAccountsSlice = createSlice({
  name: 'sistersAccounts',
  initialState,
  reducers: {
    setSistersAccounts: (state, action: PayloadAction<SisterAccount[]>) => {
      state.accounts = action.payload;
    },
    addSisterAccount: (state, action: PayloadAction<SisterAccount>) => {
      if( state.accounts )
        state.accounts.push(action.payload);
    },
    removeSisterAccount: (state, action: PayloadAction<string>) => {
      if( state.accounts)
        state.accounts = state.accounts.filter(account => account._id !== action.payload);
    }
  }
});

export const { setSistersAccounts, addSisterAccount, removeSisterAccount } = sistersAccountsSlice.actions;
export default sistersAccountsSlice.reducer;
