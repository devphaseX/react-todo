import { configureStore } from '@reduxjs/toolkit';
import todoReducer from './slices/todoSlice';

const store = configureStore({
  reducer: {
    todo: todoReducer,
  },
});

export type StoreState = ReturnType<typeof store['getState']>;
export default store;
