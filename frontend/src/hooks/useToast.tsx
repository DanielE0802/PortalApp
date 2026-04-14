'use client';

import * as React from 'react';
import { Toast, ToastContainer } from '@/components/ui/toast';

interface ToastOptions {
  variant?: 'success' | 'error' | 'info';
  duration?: number;
}

interface ToastItem extends ToastOptions {
  id: string;
  message: string;
}

const ToastContext = React.createContext<{
  toast: (message: string, options?: ToastOptions) => void;
} | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastItem[]>([]);

  const toast = React.useCallback((message: string, options?: ToastOptions) => {
    const id = Math.random().toString(36).substring(7);
    setToasts((prev) => [...prev, { id, message, ...options }]);
  }, []);

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <ToastContainer>
        {toasts.map((t) => (
          <Toast
            key={t.id}
            variant={t.variant}
            duration={t.duration}
            onClose={() => removeToast(t.id)}
          >
            {t.message}
          </Toast>
        ))}
      </ToastContainer>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
