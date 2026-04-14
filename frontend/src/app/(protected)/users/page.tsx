'use client';

import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { useGetReqresUsersQuery, useImportUserMutation } from '@/store/api/usersApi';
import { UserCard } from '@/components/users/UserCard';
import { UserCardSkeleton } from '@/components/ui/Skeleton';
import { SearchInput } from '@/components/ui/SearchInput';
import { Pagination } from '@/components/ui/Pagination';
import { EmptyState } from '@/components/ui/EmptyState';
import { useToast } from '@/hooks/useToast';

export default function UsersPage() {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [importingUserId, setImportingUserId] = useState<number | null>(null);
  const { data, isLoading, isFetching } = useGetReqresUsersQuery(page);
  const [importUser, { isLoading: importing }] = useImportUserMutation();
  const { toast } = useToast();

  const filteredUsers = useMemo(() => {
    if (!data?.data) return [];
    
    if (!searchQuery.trim()) return data.data;

    const query = searchQuery.toLowerCase();
    return data.data.filter(
      (user) =>
        user.first_name.toLowerCase().includes(query) ||
        user.last_name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query)
    );
  }, [data, searchQuery]);

  const handleImport = async (userId: number) => {
    setImportingUserId(userId);

    try {
      const result = await importUser(userId).unwrap();
      const user = result.data;
      
      if (user.alreadyExisted) {
        toast(`${user.firstName} ${user.lastName} ya estaba guardado`, { variant: 'success' });
      } else {
        toast(`¡${user.firstName} ${user.lastName} importado exitosamente!`, { variant: 'success' });
      }
    } catch {
      toast('Error al importar usuario', { variant: 'error' });
    } finally {
      setImportingUserId(null);
    }
  };

  return (
    <div className="container max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Usuarios</h1>
        <p className="text-muted-foreground">
          {data?.total || 12} usuarios disponibles en ReqRes
        </p>
      </div>

      <SearchInput
        placeholder="Buscar por nombre o email..."
        value={searchQuery}
        onChange={setSearchQuery}
        className="max-w-md"
      />

      {isLoading || isFetching ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <UserCardSkeleton key={i} />
          ))}
        </div>
      ) : filteredUsers.length === 0 ? (
        <EmptyState
          icon={<Search className="size-10" />}
          title="No se encontraron usuarios"
          description="Intenta con otro término de búsqueda."
          action={searchQuery ? { label: 'Limpiar búsqueda', onClick: () => setSearchQuery('') } : undefined}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.map((user) => (
              <UserCard
                key={user.id}
                user={user}
                onImport={handleImport}
                importing={importing && importingUserId === user.id}
              />
            ))}
          </div>

          {data && !searchQuery && (
            <Pagination
              currentPage={page}
              totalPages={data.total_pages}
              onPageChange={setPage}
            />
          )}
        </>
      )}
    </div>
  );
}
