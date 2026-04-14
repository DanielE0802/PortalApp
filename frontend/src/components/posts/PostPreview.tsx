'use client';

import { Card } from '@/components/ui/card';
import { Avatar } from '@/components/ui/Avatar';

interface PostPreviewProps {
  title: string;
  content: string;
  authorName?: string;
  authorAvatar?: string | null;
}

export function PostPreview({ title, content, authorName, authorAvatar }: PostPreviewProps) {
  return (
    <Card className="p-6 space-y-4 h-full">
      <p className="text-xs text-muted-foreground">Vista previa</p>

      <div className="space-y-3">
        <h2 className="text-xl font-medium text-foreground line-clamp-2">
          {title || <span className="text-muted-foreground">Sin título</span>}
        </h2>

        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-6">
          {content || 'El contenido aparecerá aquí...'}
        </p>
      </div>

      <div className="border-t border-border pt-4">
        {authorName ? (
          <div className="flex items-center gap-2">
            <Avatar src={authorAvatar ?? undefined} name={authorName} size="sm" />
            <span className="text-xs text-muted-foreground">Por {authorName}</span>
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">Por —</p>
        )}
      </div>
    </Card>
  );
}
