import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
  name: 'userSlice',
  initialState: { nickname: '', email: '' },
  reducers: {
    storeUser(state, action) {
      const { nickname, email } = action.payload;
      state = {
        nickname,
        email,
      };
      return state;
    },
  },
});

export const { storeUser } = userSlice.actions;
