'use client';

import Link from 'next/link';
import { Eye, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import type { ReqresUser } from '@/store/api/usersApi';

interface UserCardProps {
  user: ReqresUser;
  onImport: (id: number) => void;
  importing: boolean;
}

export function UserCard({ user, onImport, importing }: UserCardProps) {
  const fullName = `${user.first_name} ${user.last_name}`;

  return (
    <div className="bg-card border border-border rounded-xl p-6 space-y-4 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-4">
        <Avatar
          src={user.avatar}
          name={fullName}
          size="lg"
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground truncate">{fullName}</h3>
          <p className="text-sm text-muted-foreground truncate">{user.email}</p>
          {user.isSaved && (
            <Badge variant="saved" className="mt-2">
              Guardado
            </Badge>
          )}
        </div>
      </div>

      <div className="flex gap-2">
        <Link href={`/users/${user.id}`} className="flex-1">
          <Button
            variant="outline"
            size="sm"
            className="w-full"
          >
            <Eye className="size-4 mr-1" />
            Ver detalle
          </Button>
        </Link>
        <Button
          variant="default"
          size="sm"
          className="flex-1"
          onClick={() => onImport(user.id)}
          disabled={user.isSaved || importing}
        >
          <Download className="size-4 mr-1" />
          {user.isSaved ? 'Importado' : 'Importar'}
        </Button>
      </div>
    </div>
  );
}
