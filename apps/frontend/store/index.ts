import { configureStore } from '@reduxjs/toolkit';
import auth from './auth/slice';

const store = configureStore({
  reducer: {
    auth,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
