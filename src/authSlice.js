import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuthenticated: false,
};

export const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    login: (state) => {
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.isAuthenticated = false;
    },
  },
});
export const { login, logout } = counterSlice.actions;
export default counterSlice.reducer;
