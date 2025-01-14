import { configureStore } from '@reduxjs/toolkit';
import dataSlice from './dataSlice';

export const store = configureStore({
  reducer: {
    dataSlice: dataSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;  // Type cho state
export type AppDispatch = typeof store.dispatch;  
