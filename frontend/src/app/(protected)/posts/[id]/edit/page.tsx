'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { PostForm } from '@/components/posts/PostForm';
import { PostPreview } from '@/components/posts/PostPreview';
import { PostCardSkeleton } from '@/components/ui/Skeleton';
import { useGetPostQuery, useUpdatePostMutation } from '@/store/api/postsApi';
import { useGetSavedUsersQuery } from '@/store/api/usersApi';
import { useToast } from '@/hooks/useToast';
import type { PostFormValues } from '@/components/posts/PostForm';

export default function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { toast } = useToast();

  const [preview, setPreview] = useState<Partial<PostFormValues>>({});
  const [showDiscard, setShowDiscard] = useState(false);
  const [isDirtyState, setIsDirtyState] = useState(false);

  const { data: postData, isLoading: loadingPost } = useGetPostQuery(id);
  const { data: savedUsersData } = useGetSavedUsersQuery({ page: 1, limit: 100 });
  const [updatePost, { isLoading: updating }] = useUpdatePostMutation();

  const post = postData?.data;
  const savedUsers = savedUsersData?.data ?? [];

  const handleSubmit = async (data: PostFormValues) => {
    try {
      await updatePost({ id, body: data }).unwrap();
      toast('Post actualizado exitosamente', { variant: 'success' });
      router.push(`/posts/${id}`);
    } catch {
      toast('Error al actualizar el post', { variant: 'error' });
    }
  };

  const handleCancel = () => {
    if (isDirtyState) {
      setShowDiscard(true);
    } else {
      router.push(`/posts/${id}`);
    }
  };

  const authorId = preview.authorUserId ?? post?.authorUserId;
  const previewAuthor = authorId ? savedUsers.find((u) => u.id === authorId) : undefined;
  const authorName = previewAuthor
    ? `${previewAuthor.firstName} ${previewAuthor.lastName}`
    : undefined;

  if (loadingPost) {
    return (
      <div className="container max-w-7xl mx-auto p-6 space-y-6">
        <div className="h-5 w-48 bg-muted animate-pulse rounded" />
        <PostCardSkeleton />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container max-w-4xl mx-auto p-6">
        <p className="text-muted-foreground">Post no encontrado.</p>
        <Button variant="ghost" onClick={() => router.push('/posts')} className="mt-4 gap-1.5">
          <ArrowLeft className="size-4" /> Volver
        </Button>
      </div>
    );
  }

  const defaultValues: PostFormValues = {
    title: post.title,
    content: post.content,
    ...(post.authorUserId ? { authorUserId: post.authorUserId } : {}),
    ...(post.reqresAuthorId ? { reqresAuthorId: post.reqresAuthorId } : {}),
  };

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
        <button
          onClick={() => router.push(`/posts/${id}`)}
          className="cursor-pointer hover:text-foreground transition-colors"
        >
          #{id.slice(0, 8)}
        </button>
        <span>›</span>
        <span className="text-foreground">Editar</span>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={handleCancel} className="gap-1.5">
          <ArrowLeft className="size-4" />
          Cancelar
        </Button>
        <h1 className="text-2xl font-medium text-foreground">Editar Post</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PostForm
          mode="edit"
          defaultValues={defaultValues}
          savedUsers={savedUsers}
          isLoading={updating}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          onValuesChange={(vals) => {
            setPreview(vals);
            setIsDirtyState(true);
          }}
        />

        <div className="hidden lg:block">
          <PostPreview
            title={preview.title ?? post.title}
            content={preview.content ?? post.content}
            authorName={authorName}
          />
        </div>
      </div>

      <ConfirmModal
        open={showDiscard}
        onOpenChange={setShowDiscard}
        onConfirm={() => router.push(`/posts/${id}`)}
        title="¿Descartar cambios?"
        message="Perderás los cambios que has realizado."
        confirmLabel="Descartar"
      />
    </div>
  );
}
