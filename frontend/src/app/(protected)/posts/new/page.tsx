'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { PostForm } from '@/components/posts/PostForm';
import { PostPreview } from '@/components/posts/PostPreview';
import { useCreatePostMutation } from '@/store/api/postsApi';
import { useGetSavedUsersQuery } from '@/store/api/usersApi';
import { useToast } from '@/hooks/useToast';
import type { PostFormValues } from '@/components/posts/PostForm';

export default function NewPostPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const authorUserIdParam = searchParams.get('authorUserId');
  const reqresAuthorIdParam = searchParams.get('reqresAuthorId');

  const [preview, setPreview] = useState<PostFormValues>({ title: '', content: '' });
  const [showDiscard, setShowDiscard] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const { data: savedUsersData } = useGetSavedUsersQuery({ page: 1, limit: 100 });
  const [createPost, { isLoading }] = useCreatePostMutation();

  const savedUsers = savedUsersData?.data ?? [];

  const defaultValues: Partial<PostFormValues> = {};
  if (authorUserIdParam) defaultValues.authorUserId = parseInt(authorUserIdParam);
  if (reqresAuthorIdParam) defaultValues.reqresAuthorId = parseInt(reqresAuthorIdParam);

  const handleSubmit = async (data: PostFormValues) => {
    try {
      const body: Parameters<typeof createPost>[0] = {
        title: data.title,
        content: data.content,
        ...(data.authorUserId && { authorUserId: data.authorUserId }),
        ...(reqresAuthorIdParam && { reqresAuthorId: parseInt(reqresAuthorIdParam) }),
      };
      const result = await createPost(body).unwrap();
      toast('Post publicado exitosamente', { variant: 'success' });
      router.push(`/posts/${result.data.id}`);
    } catch {
      toast('Error al crear el post', { variant: 'error' });
    }
  };

  const handleCancel = () => {
    if (isDirty) {
      setShowDiscard(true);
    } else {
      router.push('/posts');
    }
  };

  const previewAuthor = savedUsers.find((u) => u.id === preview.authorUserId);
  const authorName = previewAuthor
    ? `${previewAuthor.firstName} ${previewAuthor.lastName}`
    : undefined;

  return (
    <div className="container max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <button
          onClick={() => router.push('/posts')}
          className="cursor-pointer hover:text-foreground transition-colors"
        >
          Posts
        </button>
        <span>›</span>
        <span className="text-foreground">Nuevo</span>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={handleCancel} className="gap-1.5">
          <ArrowLeft className="size-4" />
          Cancelar
        </Button>
        <h1 className="text-2xl font-medium text-foreground">Crear Nuevo Post</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PostForm
          mode="create"
          defaultValues={defaultValues}
          savedUsers={savedUsers}
          isLoading={isLoading}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          onValuesChange={(vals) => {
            setPreview(vals);
            setIsDirty(!!(vals.title || vals.content));
          }}
          fixedReqresAuthorId={reqresAuthorIdParam ? parseInt(reqresAuthorIdParam) : undefined}
        />

        <div className="hidden lg:block">
          <PostPreview
            title={preview.title}
            content={preview.content}
            authorName={authorName}
          />
        </div>
      </div>

      <ConfirmModal
        open={showDiscard}
        onOpenChange={setShowDiscard}
        onConfirm={() => router.push('/posts')}
        title="¿Descartar cambios?"
        message="Perderás el contenido que has escrito. Esta acción no se puede deshacer."
        confirmLabel="Descartar"
      />
    </div>
  );
}
