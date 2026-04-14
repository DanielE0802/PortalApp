'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Pencil, Trash2, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar } from '@/components/ui/Avatar';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { PostCardSkeleton } from '@/components/ui/Skeleton';
import { useGetPostQuery, useDeletePostMutation } from '@/store/api/postsApi';
import { useToast } from '@/hooks/useToast';
import { formatDate } from '@/lib/utils';

export default function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { toast } = useToast();
  const [showDelete, setShowDelete] = useState(false);

  const { data, isLoading } = useGetPostQuery(id);
  const [deletePost, { isLoading: deleting }] = useDeletePostMutation();

  const post = data?.data;

  const handleDelete = async () => {
    try {
      await deletePost(id).unwrap();
      toast('Post eliminado exitosamente', { variant: 'success' });
      router.push('/posts');
    } catch {
      toast('Error al eliminar el post', { variant: 'error' });
    }
  };

  if (isLoading) {
    return (
      <div className="container max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
        <div className="h-5 w-40 bg-muted animate-pulse rounded" />
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

  const authorName = post.author
    ? `${post.author.firstName} ${post.author.lastName}`
    : null;

  return (
    <div className="container max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <button
          onClick={() => router.push('/posts')}
          className="cursor-pointer hover:text-foreground transition-colors"
        >
          Posts
        </button>
        <span>›</span>
        <span className="text-foreground">#{id.slice(0, 8)}</span>
      </div>

      <Button variant="ghost" size="sm" onClick={() => router.push('/posts')} className="gap-1.5">
        <ArrowLeft className="size-4" />
        Volver
      </Button>

      <Card className="p-5 sm:p-8 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <h1 className="text-2xl font-medium text-foreground leading-snug">
            {post.title}
          </h1>
          <div className="flex items-center gap-2 sm:shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/posts/${id}/edit`)}
              className="gap-1.5 flex-1 sm:flex-none"
            >
              <Pencil className="size-4" />
              Editar
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDelete(true)}
              className="gap-1.5 flex-1 sm:flex-none border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/50"
            >
              <Trash2 className="size-4" />
              Eliminar
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Calendar className="size-3.5" />
            Creado el {formatDate(post.createdAt)}
          </span>
          {post.updatedAt !== post.createdAt && (
            <span>Editado el {formatDate(post.updatedAt)}</span>
          )}
        </div>

        <p className="text-base leading-relaxed text-foreground/90 whitespace-pre-wrap">
          {post.content}
        </p>

        <div className="border-t border-border pt-5 space-y-3">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Autor</p>
          {authorName ? (
            <div className="flex items-center gap-3">
              <Avatar
                src={post.author?.avatar ?? undefined}
                name={authorName}
                size="md"
              />
              <div>
                <p className="text-sm font-medium text-foreground">{authorName}</p>
                <p className="text-xs text-muted-foreground">{post.author?.email}</p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Sin autor asignado</p>
          )}
        </div>
      </Card>

      <ConfirmModal
        open={showDelete}
        onOpenChange={setShowDelete}
        onConfirm={handleDelete}
        title="Eliminar post"
        message="¿Estás seguro de que deseas eliminar este post? Esta acción no se puede deshacer."
        confirmLabel="Eliminar"
        loading={deleting}
      />
    </div>
  );
}
