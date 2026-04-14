import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { baseApi } from '@/store/api/baseApi';
import { authSlice } from '@/store/slices/authSlice';
import { uiSlice } from '@/store/slices/uiSlice';

export function createTestStore(preloadedState = {}) {
  return configureStore({
    reducer: {
      auth: authSlice.reducer,
      ui: uiSlice.reducer,
      [baseApi.reducerPath]: baseApi.reducer,
    },
    middleware: (getDefault) => getDefault().concat(baseApi.middleware),
    preloadedState,
  });
}

export function TestProvider({ children }: { children: React.ReactNode }) {
  const store = createTestStore();
  return <Provider store={store}>{children}</Provider>;
}
