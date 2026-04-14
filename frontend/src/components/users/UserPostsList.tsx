'use client';

import Link from 'next/link';
import { FileText } from 'lucide-react';
import { Card } from '@/components/ui/card';
import type { Post } from '@/store/api/postsApi';

interface UserPostsListProps {
  posts: Post[];
  userId: number;
  isReqresUser?: boolean;
}

export function UserPostsList({ posts, userId, isReqresUser }: UserPostsListProps) {
  if (posts.length === 0) {
    return (
      <Card className="p-12 text-center">
        <FileText className="size-10 mx-auto mb-4 text-muted-foreground" />
        <p className="text-base text-muted-foreground mb-4">
          Este usuario no tiene posts
        </p>
        <Link
          href={`/posts/new?${isReqresUser ? 'reqresAuthorId' : 'authorUserId'}=${userId}`}
          className="inline-flex items-center justify-center rounded-lg border border-accent/30 bg-background px-4 py-2 text-sm font-medium text-accent hover:bg-accent/10 transition-colors"
        >
          Crear post para este usuario
        </Link>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {posts.map((post) => (
        <Link key={post.id} href={`/posts/${post.id}`}>
          <Card className="p-4 hover:bg-card/80 transition-colors cursor-pointer">
            <div className="flex gap-3 items-start">
              <FileText className="size-5 text-accent shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-normal text-foreground mb-1 truncate">
                  {post.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-1">
                  {post.content}
                </p>
              </div>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
}
