'use client';

import { usePathname } from 'next/navigation';
import { ChevronRight, Menu } from 'lucide-react';
import { useAppDispatch } from '@/store';
import { toggleSidebar } from '@/store/slices/uiSlice';

const breadcrumbMap: Record<string, string> = {
  '/users': 'Usuarios',
  '/users/saved': 'Usuarios Guardados',
  '/posts': 'Posts',
  '/posts/new': 'Nuevo Post',
};

function getBreadcrumb(pathname: string): string {
  if (breadcrumbMap[pathname]) return breadcrumbMap[pathname];
  if (pathname.startsWith('/posts/') && pathname.endsWith('/edit')) return 'Editar Post';
  if (pathname.startsWith('/users/')) return 'Detalle Usuario';
  if (pathname.startsWith('/posts/')) return 'Detalle Post';
  return 'Dashboard';
}

export function TopBar() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const breadcrumb = getBreadcrumb(pathname);

  return (
    <header className="h-14 border-b border-border bg-background px-4 flex items-center gap-3 shrink-0">
      <button
        onClick={() => dispatch(toggleSidebar())}
        className="lg:hidden p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
        aria-label="Abrir menú"
      >
        <Menu className="size-5" />
      </button>

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span className="hidden sm:inline">Inicio</span>
        <ChevronRight className="size-4 hidden sm:block" />
        <span className="text-foreground font-medium">{breadcrumb}</span>
      </div>
    </header>
  );
}
