'use client';

import { useState } from 'react';
import { useGetSavedUsersQuery, useDeleteSavedUserMutation } from '@/store/api/usersApi';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/button';
import { TableRowSkeleton } from '@/components/ui/Skeleton';
import { Pagination } from '@/components/ui/Pagination';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { useToast } from '@/hooks/useToast';
import { Eye, Plus, Trash2, BookmarkCheck } from 'lucide-react';
import { formatShortDate } from '@/lib/utils';
import { EmptyState } from '@/components/ui/EmptyState';
import Link from 'next/link';

export default function SavedUsersPage() {
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const { data, isLoading } = useGetSavedUsersQuery({ page, limit: 10 });
  const [deleteUser, { isLoading: deleting }] = useDeleteSavedUserMutation();
  const { toast } = useToast();

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await deleteUser(deleteId).unwrap();
      toast('Usuario eliminado exitosamente', { variant: 'success' });
      setDeleteId(null);
    } catch {
      toast('Error al eliminar usuario', { variant: 'error' });
    }
  };

  const savedUsers = data?.data || [];
  const totalPages = data?.meta?.totalPages || 1;

  if (isLoading) {
    return (
      <div className="container max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Usuarios Guardados</h1>
          <p className="text-muted-foreground">Cargando...</p>
        </div>
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          {Array.from({ length: 5 }).map((_, i) => (
            <TableRowSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (savedUsers.length === 0) {
    return (
      <div className="container max-w-7xl mx-auto p-4 sm:p-6">
        <div className="space-y-2 mb-6">
          <h1 className="text-3xl font-bold text-foreground">Usuarios Guardados</h1>
          <p className="text-muted-foreground">0 usuarios importados</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-12">
          <EmptyState
            icon={<BookmarkCheck className="size-10" />}
            title="Aún no has importado usuarios"
            description="Importa usuarios desde el listado de ReqRes para verlos aquí."
            action={{ label: 'Ir al listado de usuarios', href: '/users' }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Usuarios Guardados</h1>
        <p className="text-muted-foreground">
          {data?.meta?.total || 0} usuarios importados
        </p>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                  Usuario
                </th>
                <th className="hidden sm:table-cell text-left p-4 text-sm font-medium text-muted-foreground">
                  Email
                </th>
                <th className="hidden md:table-cell text-left p-4 text-sm font-medium text-muted-foreground">
                  ReqRes ID
                </th>
                <th className="hidden md:table-cell text-left p-4 text-sm font-medium text-muted-foreground">
                  Fecha import
                </th>
                <th className="hidden sm:table-cell text-left p-4 text-sm font-medium text-muted-foreground">
                  Posts
                </th>
                <th className="text-right p-4 text-sm font-medium text-muted-foreground">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {savedUsers.map((user) => (
                <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <Avatar
                        src={user.avatar}
                        name={`${user.firstName} ${user.lastName}`}
                        size="sm"
                      />
                      <span className="font-medium text-foreground text-sm">
                        {user.firstName} {user.lastName}
                      </span>
                    </div>
                  </td>
                  <td className="hidden sm:table-cell p-4 text-sm text-muted-foreground">
                    {user.email}
                  </td>
                  <td className="hidden md:table-cell p-4 text-sm text-muted-foreground">
                    #{user.reqresId}
                  </td>
                  <td className="hidden md:table-cell p-4 text-sm text-muted-foreground">
                    {formatShortDate(user.createdAt)}
                  </td>
                  <td className="hidden sm:table-cell p-4 text-sm text-muted-foreground">
                    {user.postCount || 0}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/users/${user.reqresId}`}>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          title="Ver detalle"
                        >
                          <Eye className="size-4" />
                        </Button>
                      </Link>
                      <Link href={`/posts/new?authorUserId=${user.id}`}>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          title="Crear post"
                        >
                          <Plus className="size-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => setDeleteId(user.id)}
                        title="Eliminar"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}

      <ConfirmModal
        open={deleteId !== null}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Eliminar usuario"
        message="¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer."
        confirmLabel="Eliminar"
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  );
}
