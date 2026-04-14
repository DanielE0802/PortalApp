'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Plus, FileText, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SearchInput } from '@/components/ui/SearchInput';
import { Pagination } from '@/components/ui/Pagination';
import { PostCard } from '@/components/posts/PostCard';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { useGetPostsQuery, useDeletePostMutation } from '@/store/api/postsApi';
import { EmptyState } from '@/components/ui/EmptyState';
import { useToast } from '@/hooks/useToast';
import { useDebounce } from '@/hooks/useDebounce';

const ORDER_OPTIONS = [
  { value: 'newest', label: 'Más reciente' },
  { value: 'oldest', label: 'Más antiguo' },
  { value: 'title', label: 'Por título' },
] as const;

export default function PostsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [orderBy, setOrderBy] = useState<'newest' | 'oldest' | 'title'>(
    (searchParams.get('orderBy') as 'newest' | 'oldest' | 'title') || 'newest'
  );
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const debouncedSearch = useDebounce(searchQuery, 500);

  const { data, isLoading } = useGetPostsQuery({
    page,
    limit: 10,
    search: debouncedSearch || undefined,
    orderBy,
  });

  const [deletePost, { isLoading: deleting }] = useDeletePostMutation();

  const posts = data?.data || [];
  const totalPages = data?.meta?.totalPages || 1;
  const total = data?.meta?.total || 0;

  useEffect(() => {
    const params = new URLSearchParams();
    if (page > 1) params.set('page', page.toString());
    if (searchQuery) params.set('search', searchQuery);
    if (orderBy !== 'newest') params.set('orderBy', orderBy);

    const newUrl = params.toString() ? `/posts?${params.toString()}` : '/posts';
    router.replace(newUrl, { scroll: false });
  }, [page, searchQuery, orderBy, router]);

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await deletePost(deleteId).unwrap();
      toast('Post eliminado exitosamente', { variant: 'success' });
      setDeleteId(null);
    } catch {
      toast('Error al eliminar post', { variant: 'error' });
    }
  };

  if (isLoading && posts.length === 0) {
    return (
      <div className="container max-w-7xl mx-auto p-6 space-y-6">
        <div className="h-10 w-48 bg-muted animate-pulse rounded" />
        <div className="flex gap-4">
          <div className="h-9 flex-1 bg-muted animate-pulse rounded" />
          <div className="h-9 w-40 bg-muted animate-pulse rounded" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-48 bg-muted animate-pulse rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-foreground">Posts</h1>
          <p className="text-muted-foreground">
            {total} {total === 1 ? 'post' : 'posts'} en total
          </p>
        </div>
        
        <Button onClick={() => router.push('/posts/new')} className="gap-2">
          <Plus className="size-4" />
          Crear Post
        </Button>
      </div>

      <div className="flex gap-4">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Buscar por título..."
          className="flex-1"
        />
        
        <select
          value={orderBy}
          onChange={(e) => setOrderBy(e.target.value as 'newest' | 'oldest' | 'title')}
          className="h-9 cursor-pointer px-3 rounded-lg border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          {ORDER_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {posts.length === 0 ? (
        <EmptyState
          icon={debouncedSearch ? <Search className="size-10" /> : <FileText className="size-10" />}
          title={debouncedSearch ? 'No se encontraron posts' : 'No hay posts aún'}
          description={debouncedSearch ? 'Intenta con otro término de búsqueda.' : 'Crea tu primer post para empezar.'}
          action={
            debouncedSearch
              ? { label: 'Limpiar búsqueda', onClick: () => setSearchQuery('') }
              : { label: 'Crear tu primer post', href: '/posts/new' }
          }
        />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onDelete={setDeleteId}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          )}
        </>
      )}

      <ConfirmModal
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        onConfirm={handleDelete}
        title="Eliminar post"
        message="¿Estás seguro de que deseas eliminar este post? Esta acción no se puede deshacer."
        confirmLabel="Eliminar"
        loading={deleting}
      />
    </div>
  );
}
