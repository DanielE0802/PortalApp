'use client';

import { usePathname } from 'next/navigation';
import { ChevronRight } from 'lucide-react';

const breadcrumbMap: Record<string, string> = {
  '/users': 'Usuarios',
  '/users/saved': 'Usuarios Guardados',
  '/posts': 'Posts',
  '/posts/new': 'Nuevo Post',
};

export function TopBar() {
  const pathname = usePathname();
  
  const breadcrumb = breadcrumbMap[pathname] || 'Dashboard';

  return (
    <header className="h-16 border-b border-border bg-background px-6 flex items-center">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>Inicio</span>
        <ChevronRight className="size-4" />
        <span className="text-foreground font-medium">{breadcrumb}</span>
      </div>
    </header>
  );
}
