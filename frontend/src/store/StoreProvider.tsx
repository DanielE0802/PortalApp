'use client';

import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from './index';
import { hydrateAuth } from './slices/authSlice';

export function StoreProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const token = localStorage.getItem('portalapp_token');
    store.dispatch(hydrateAuth({ token }));
  }, []);

  return <Provider store={store}>{children}</Provider>;
}
