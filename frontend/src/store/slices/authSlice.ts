import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
}

const initialState: AuthState = {
  token: null,
  isAuthenticated: false,
  isHydrated: false,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    hydrateAuth(state, action: PayloadAction<{ token: string | null }>) {
      state.token = action.payload.token;
      state.isAuthenticated = !!action.payload.token;
      state.isHydrated = true;
    },
    setCredentials(state, action: PayloadAction<{ token: string }>) {
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.isHydrated = true;
      if (typeof window !== 'undefined') {
        localStorage.setItem('portalapp_token', action.payload.token);
        document.cookie = `portalapp_token=${action.payload.token}; path=/; max-age=86400; SameSite=Lax`;
      }
    },
    logout(state) {
      state.token = null;
      state.isAuthenticated = false;
      state.isHydrated = true;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('portalapp_token');
        document.cookie = 'portalapp_token=; path=/; max-age=0';
      }
    },
  },
});

export const { hydrateAuth, setCredentials, logout } = authSlice.actions;
