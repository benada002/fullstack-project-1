import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const { reducer, actions } = createSlice({
  name: 'ui',
  initialState: {
    loading: false,
    error: Error,
  },
  reducers: {
    setLoading: (state, { payload }: PayloadAction<boolean>) => {
      state.loading = payload;
    },
    setError: (state, { payload }: PayloadAction<Error>) => {
      state.error = payload;
    },
  },
});

export const { setLoading, setError } = actions;

export default reducer;
