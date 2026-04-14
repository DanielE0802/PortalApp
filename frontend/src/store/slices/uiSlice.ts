import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Toast {
  id: string;
  type: 'success' | 'error';
  message: string;
}

interface UiState {
  toasts: Toast[];
  sidebarOpen: boolean;
}

const initialState: UiState = {
  toasts: [],
  sidebarOpen: false,
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    addToast(state, action: PayloadAction<Omit<Toast, 'id'>>) {
      state.toasts.push({
        ...action.payload,
        id: Date.now().toString(),
      });
    },
    removeToast(state, action: PayloadAction<string>) {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload);
    },
    toggleSidebar(state) {
      state.sidebarOpen = !state.sidebarOpen;
    },
    closeSidebar(state) {
      state.sidebarOpen = false;
    },
  },
});

export const { addToast, removeToast, toggleSidebar, closeSidebar } = uiSlice.actions;
