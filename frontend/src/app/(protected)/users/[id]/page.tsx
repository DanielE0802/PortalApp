'use client';

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserProfile } from '@/components/users/UserProfile';
import { UserPostsList } from '@/components/users/UserPostsList';
import { useGetReqresUserQuery, useImportUserMutation } from '@/store/api/usersApi';
import { useGetPostsQuery } from '@/store/api/postsApi';
import { useToast } from '@/hooks/useToast';

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const reqresId = Number(params.id);

  const { data: userData, isLoading: loadingUser } = useGetReqresUserQuery(reqresId);
  const [importUser, { isLoading: importing }] = useImportUserMutation();

  const user = userData?.data;
  const localId = user?.localId;
  const isSaved = user?.isSaved;

  const { data: postsData, isLoading: loadingPosts } = useGetPostsQuery(
    isSaved && localId
      ? { authorUserId: localId }
      : { reqresAuthorId: reqresId },
    { skip: !user }
  );

  const posts = postsData?.data ?? [];

  const handleImport = async () => {
    try {
      const result = await importUser(reqresId).unwrap();
      const importedUser = result.data;
      
      if (importedUser.alreadyExisted) {
        toast(`${importedUser.firstName} ${importedUser.lastName} ya estaba guardado`, { variant: 'success' });
      } else {
        toast(`¡${importedUser.firstName} ${importedUser.lastName} importado exitosamente!`, { variant: 'success' });
      }
    } catch {
      toast('Error al importar usuario', { variant: 'error' });
    }
  };

  if (loadingUser) {
    return (
      <div className="container max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
        <div className="h-9 w-24 bg-muted animate-pulse rounded" />
        <div className="h-48 bg-muted animate-pulse rounded-xl" />
        <div className="space-y-2">
          <div className="h-8 w-48 bg-muted animate-pulse rounded" />
          <div className="h-20 bg-muted animate-pulse rounded-xl" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container max-w-4xl mx-auto p-6">
        <p className="text-center text-muted-foreground">Usuario no encontrado</p>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      <Button
        variant="ghost"
        onClick={() => router.push('/users')}
        className="gap-2"
      >
        <ArrowLeft className="size-4" />
        Volver
      </Button>

      <UserProfile
        user={user}
        onImport={handleImport}
        importing={importing}
      />

      <div className="space-y-3">
        <h2 className="text-xl font-medium text-foreground">
          Posts del usuario
        </h2>
        
        {loadingPosts ? (
          <div className="space-y-2">
            <div className="h-20 bg-muted animate-pulse rounded-xl" />
            <div className="h-20 bg-muted animate-pulse rounded-xl" />
          </div>
        ) : (
          <UserPostsList
            posts={posts}
            userId={isSaved && localId ? localId : reqresId}
            isReqresUser={!isSaved}
          />
        )}
      </div>
    </div>
  );
}
