// store.js 파일 ---> state 보관하는 통.

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: PostStateType[] = [];

// 요런 state 하나를 "slice" 라고 부름.
export const postSlice = createSlice({
  name: 'postSlice',
  initialState,
  reducers: {
    getPost(state, action: PayloadAction<PostStateType[]>) {
      state = [...action.payload];
      return state;
    },
  },
});

export const { getPost } = postSlice.actions;

interface PostStateType {
  id: number;
  username: string;
  title: string;
  content: string;
  time: string;
}
