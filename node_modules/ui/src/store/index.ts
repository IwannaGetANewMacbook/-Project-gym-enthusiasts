// https://velog.io/@eunjios/React-Redux-Toolkit-TypeScript-%EC%82%AC%EC%9A%A9%ED%95%98%EA%B8%B0

import { configureStore } from '@reduxjs/toolkit';
import { postSlice } from './post';
import { userSlice } from './user';

const store = configureStore({
  // reducer 프로퍼티 -> 만든 state 등록하는 곳
  reducer: {
    postSlice: postSlice.reducer,
    userSlice: userSlice.reducer,
  },
});

// Redux 스토어의 state를 나타내는 타입
export type RootState = ReturnType<typeof store.getState>;
// Redux 액션을 dispatch하는 함수의 타입
export type AppDispatch = typeof store.dispatch;

export default store;
