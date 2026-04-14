'use client';

import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Download } from 'lucide-react';
import type { ReqresUser } from '@/store/api/usersApi';

interface UserProfileProps {
  user: ReqresUser;
  onImport?: () => void;
  importing?: boolean;
}

export function UserProfile({ user, onImport, importing }: UserProfileProps) {
  const fullName = `${user.first_name} ${user.last_name}`;
  const canImport = !user.isSaved && onImport;

  return (
    <Card className="p-6">
      <div className="flex gap-6">
        <Avatar
          src={user.avatar}
          name={fullName}
          size="lg"
          className="ring-2 ring-accent/30"
        />
        
        <div className="flex-1 space-y-4">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-medium text-foreground">
              {fullName}
            </h1>
            <Badge variant={user.isSaved ? 'saved' : 'notSaved'}>
              {user.isSaved ? 'Guardado en BD' : 'No guardado'}
            </Badge>
          </div>
          
          <p className="text-base text-muted-foreground">
            {user.email}
          </p>
          
          <p className="text-sm text-muted-foreground">
            ReqRes ID: #{user.id}
          </p>
          
          {canImport && (
            <Button
              onClick={onImport}
              disabled={importing}
              className="gap-2"
            >
              <Download className="size-4" />
              {importing ? 'Importando...' : 'Importar a BD'}
            </Button>
          )}
          
          {user.isSaved && (
            <Button disabled className="gap-2 opacity-50">
              <Download className="size-4" />
              Ya importado
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
