'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { Button } from './button';
import { X } from 'lucide-react';

interface ConfirmModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  loading?: boolean;
}

export function ConfirmModal({
  open,
  onOpenChange,
  title,
  message,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  onConfirm,
  loading = false,
}: ConfirmModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50" onClick={() => onOpenChange(false)} />
          <div className="relative bg-card border border-border rounded-xl p-6 w-full max-w-md shadow-lg z-10">
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">
                {title}
              </h2>
              <button
                onClick={() => onOpenChange(false)}
                className="cursor-pointer text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="size-5" />
              </button>
            </div>
            
            <p className="text-sm text-muted-foreground mb-6">
              {message}
            </p>
            
            <div className="flex gap-3 justify-end">
              <Button 
                variant="outline" 
                disabled={loading}
                onClick={() => onOpenChange(false)}
              >
                {cancelLabel}
              </Button>
              <Button
                variant="destructive"
                onClick={onConfirm}
                disabled={loading}
              >
                {loading ? 'Procesando...' : confirmLabel}
              </Button>
            </div>
          </div>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
