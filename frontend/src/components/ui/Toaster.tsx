'use client';

import { useEffect } from 'react';
import { CheckCircle2, XCircle, X } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/store';
import { removeToast } from '@/store/slices/uiSlice';
import { cn } from '@/lib/utils';

export function Toaster() {
  const toasts = useAppSelector((s) => s.ui.toasts);
  const dispatch = useAppDispatch();

  useEffect(() => {
    toasts.forEach((toast) => {
      const timer = setTimeout(() => {
        dispatch(removeToast(toast.id));
      }, 4000);

      return () => clearTimeout(timer);
    });
  }, [toasts, dispatch]);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-md">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            'flex items-center gap-3 p-4 rounded-lg shadow-lg border animate-in slide-in-from-top-5',
            toast.type === 'success'
              ? 'bg-green-50 border-green-200 text-green-900 dark:bg-green-900/20 dark:border-green-800 dark:text-green-100'
              : 'bg-red-50 border-red-200 text-red-900 dark:bg-red-900/20 dark:border-red-800 dark:text-red-100'
          )}
        >
          {toast.type === 'success' ? (
            <CheckCircle2 className="size-5 text-green-600 dark:text-green-400 shrink-0" />
          ) : (
            <XCircle className="size-5 text-red-600 dark:text-red-400 shrink-0" />
          )}
          <p className="flex-1 text-sm font-medium">{toast.message}</p>
          <button
            onClick={() => dispatch(removeToast(toast.id))}
            className="shrink-0 hover:opacity-70 transition-opacity"
          >
            <X className="size-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
