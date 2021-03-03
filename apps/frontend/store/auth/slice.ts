import { createSlice, SliceCaseReducers } from '@reduxjs/toolkit';
import { IAuthState } from './types';

const { reducer, actions } = createSlice<IAuthState, SliceCaseReducers<IAuthState>>({
  name: 'auth',
  initialState: {
    accessToken: '',
    attemptedToSetToken: false,
  },
  reducers: {
    setAccessToken: (state, { payload }) => {
      state.accessToken = payload;
      state.attemptedToSetToken = true;
    },
    setAttempted: (state) => {
      state.attemptedToSetToken = true;
    },
  },
});

export const { setAccessToken, setAttempted } = actions;

export default reducer;
