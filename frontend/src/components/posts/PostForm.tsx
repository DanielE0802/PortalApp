'use client';

import { useEffect, useRef } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { SavedUser } from '@/store/api/usersApi';

const postSchema = z.object({
  title: z.string().min(3, 'Mínimo 3 caracteres').max(255, 'Máximo 255 caracteres'),
  content: z.string().min(10, 'Mínimo 10 caracteres'),
  authorUserId: z.number().int().positive().optional(),
  reqresAuthorId: z.number().int().positive().optional(),
});

export type PostFormValues = z.infer<typeof postSchema>;

interface PostFormProps {
  mode: 'create' | 'edit';
  defaultValues?: Partial<PostFormValues>;
  savedUsers: SavedUser[];
  isLoading: boolean;
  onSubmit: (data: PostFormValues) => void;
  onCancel: () => void;
  onValuesChange?: (values: PostFormValues) => void;
  fixedReqresAuthorId?: number;
}

function PostFormInner({
  mode,
  defaultValues,
  savedUsers,
  isLoading,
  onSubmit,
  onCancel,
  onValuesChange,
  fixedReqresAuthorId,
}: PostFormProps) {
  const onValuesChangeRef = useRef(onValuesChange);
  useEffect(() => {
    onValuesChangeRef.current = onValuesChange;
  });

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isDirty },
  } = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: '',
      content: '',
      ...defaultValues,
    },
  });

  const watchedTitle = useWatch({ control, name: 'title', defaultValue: '' });
  const watchedContent = useWatch({ control, name: 'content', defaultValue: '' });
  const watchedAuthorId = useWatch({ control, name: 'authorUserId' });

  useEffect(() => {
    onValuesChangeRef.current?.({
      title: watchedTitle,
      content: watchedContent,
      authorUserId: watchedAuthorId,
    });
  }, [watchedTitle, watchedContent, watchedAuthorId]);

  useEffect(() => {
    if (savedUsers.length > 0 && defaultValues?.authorUserId) {
      const exists = savedUsers.some((u) => u.id === defaultValues.authorUserId);
      if (exists) setValue('authorUserId', defaultValues.authorUserId);
    }
  }, [savedUsers, defaultValues?.authorUserId, setValue]);

  const titleLength = watchedTitle?.length ?? 0;
  const submitLabel = mode === 'create' ? 'Publicar post' : 'Guardar cambios';
  const isSubmitDisabled = isLoading || (mode === 'edit' && !isDirty);

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="title">Título</Label>
            <span className={cn('text-xs', titleLength > 230 ? 'text-destructive' : 'text-muted-foreground')}>
              {titleLength}/255
            </span>
          </div>
          <input
            id="title"
            type="text"
            placeholder="Título del post"
            className={cn(
              'w-full h-9 px-3 rounded-[10px] border bg-[#1a1a1a] text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-colors',
              errors.title ? 'border-destructive' : 'border-[rgba(255,255,255,0.08)]',
            )}
            {...register('title')}
          />
          {errors.title && (
            <p className="text-xs text-destructive">{errors.title.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="content">Contenido</Label>
          <textarea
            id="content"
            placeholder="Escribe el contenido del post..."
            rows={8}
            className={cn(
              'w-full px-3 py-2 rounded-[10px] border bg-[#1a1a1a] text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-colors resize-none',
              errors.content ? 'border-destructive' : 'border-[rgba(255,255,255,0.08)]',
            )}
            {...register('content')}
          />
          {errors.content && (
            <p className="text-xs text-destructive">{errors.content.message}</p>
          )}
        </div>

        {!fixedReqresAuthorId && (
          <div className="space-y-2">
            <Label htmlFor="authorUserId">Autor</Label>
            <select
              id="authorUserId"
              className="w-full h-9 cursor-pointer px-3 rounded-[10px] border border-[rgba(255,255,255,0.08)] bg-[#1a1a1a] text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-colors"
              {...register('authorUserId', { setValueAs: (v) => (v === '' ? undefined : Number(v)) })}
            >
              <option value="">Sin autor</option>
              {savedUsers.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.firstName} {u.lastName}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
            className="w-24"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={isSubmitDisabled}
            className="flex-1 bg-[#c8ff00] text-[#0a0a0a] hover:bg-[#b8ef00] font-medium disabled:opacity-40"
          >
            {isLoading ? 'Guardando...' : submitLabel}
          </Button>
        </div>
      </form>
    </Card>
  );
}

export { PostFormInner as PostForm };
