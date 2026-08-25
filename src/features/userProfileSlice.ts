import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

// The user requested the initial value to be null and type any
interface UserProfileState {
  profile: any | null;
}

const initialState: UserProfileState = {
  profile: null,
};

export const userProfileSlice = createSlice({
  name: 'userProfile',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<any>) => {
      state.profile = action.payload;
    },
    logout: (state) => {
      state.profile = null;
    },
  },
});

export const { login, logout } = userProfileSlice.actions;

export default userProfileSlice.reducer;
