import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface BrotherAccount {
  _id: string;
  name: string;
  phoneNumber: string;
  countryCode: string;
  role: string;
}

interface BrothersAccountsState {
  accounts: BrotherAccount[] | null;
}

const initialState: BrothersAccountsState = {
  accounts: null,
};

const brothersAccountsSlice = createSlice({
  name: 'brothersAccounts',
  initialState,
  reducers: {
    setBrothersAccounts: (state, action: PayloadAction<BrotherAccount[]>) => {
      state.accounts = action.payload;
    }
  }
});

export const { setBrothersAccounts } = brothersAccountsSlice.actions;
export default brothersAccountsSlice.reducer;
