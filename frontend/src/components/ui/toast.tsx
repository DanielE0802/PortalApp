'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

const toastVariants = cva(
  'pointer-events-auto flex w-full items-center justify-between gap-3 overflow-hidden rounded-lg border p-4 shadow-md transition-all',
  {
    variants: {
      variant: {
        success: 'bg-[var(--success-bg)] border-[var(--success-border)] text-[var(--success-text)]',
        error: 'bg-destructive/10 border-destructive/50 text-destructive',
        info: 'bg-muted border-border text-foreground',
      },
    },
    defaultVariants: {
      variant: 'info',
    },
  }
);

export interface ToastProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof toastVariants> {
  onClose?: () => void;
  duration?: number;
}

export function Toast({
  variant,
  className,
  children,
  onClose,
  duration = 5000,
  ...props
}: ToastProps) {
  React.useEffect(() => {
    if (duration && onClose) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  return (
    <div
      role="alert"
      className={cn(toastVariants({ variant }), className)}
      {...props}
    >
      <div className="flex-1 text-sm">{children}</div>
      {onClose && (
        <button
          onClick={onClose}
          className="rounded-md p-1 hover:bg-white/10 transition-colors"
          aria-label="Cerrar"
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  );
}

export interface ToastContainerProps {
  children: React.ReactNode;
}

export function ToastContainer({ children }: ToastContainerProps) {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 w-full max-w-sm pointer-events-none">
      {children}
    </div>
  );
}
