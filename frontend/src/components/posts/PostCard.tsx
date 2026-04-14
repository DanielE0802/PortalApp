'use client';

import Link from 'next/link';
import { MoreVertical, Eye, Edit, Trash2 } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatShortDate, truncate } from '@/lib/utils';
import type { Post } from '@/store/api/postsApi';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

interface PostCardProps {
  post: Post;
  onDelete: (id: string) => void;
}

export function PostCard({ post, onDelete }: PostCardProps) {
  const authorName = post.author
    ? `${post.author.firstName} ${post.author.lastName}`
    : 'Sin autor';

  return (
    <Card className="p-5 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg font-medium text-foreground flex-1 line-clamp-1">
          {post.title}
        </h3>
        
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="size-7 p-0 shrink-0"
            >
              <MoreVertical className="size-4" />
            </Button>
          </DropdownMenu.Trigger>
          
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className="min-w-[160px] bg-card border border-border rounded-lg p-1 shadow-md"
              sideOffset={5}
            >
              <DropdownMenu.Item asChild>
                <Link
                  href={`/posts/${post.id}`}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-foreground rounded-md hover:bg-accent/10 cursor-pointer outline-none"
                >
                  <Eye className="size-4" />
                  Ver detalle
                </Link>
              </DropdownMenu.Item>
              
              <DropdownMenu.Item asChild>
                <Link
                  href={`/posts/${post.id}/edit`}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-foreground rounded-md hover:bg-accent/10 cursor-pointer outline-none"
                >
                  <Edit className="size-4" />
                  Editar
                </Link>
              </DropdownMenu.Item>
              
              <DropdownMenu.Separator className="h-px bg-border my-1" />
              
              <DropdownMenu.Item
                onSelect={() => onDelete(post.id)}
                className="flex items-center gap-2 px-3 py-2 text-sm text-destructive rounded-md hover:bg-destructive/10 cursor-pointer outline-none"
              >
                <Trash2 className="size-4" />
                Eliminar
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
      
      <p className="text-sm text-muted-foreground line-clamp-2">
        {truncate(post.content, 150)}
      </p>
      
      <div className="flex items-center justify-between pt-3 border-t border-border">
        <div className="flex items-center gap-2">
          {post.author && (
            <>
              <Avatar
                src={post.author.avatar}
                name={authorName}
                size="sm"
              />
              <span className="text-xs text-muted-foreground">
                {authorName}
              </span>
            </>
          )}
          {!post.author && (
            <span className="text-xs text-muted-foreground">
              Sin autor asignado
            </span>
          )}
        </div>
        
        <span className="text-xs text-muted-foreground">
          {formatShortDate(post.createdAt)}
        </span>
      </div>
    </Card>
  );
}
