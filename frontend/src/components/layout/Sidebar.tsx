'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Users, BookmarkCheck, FileText, LogOut, Sparkles, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { useGetSavedUsersQuery } from '@/store/api/usersApi';
import { Badge } from '@/components/ui/Badge';
import { useAppSelector, useAppDispatch } from '@/store';
import { closeSidebar } from '@/store/slices/uiSlice';

const navItems = [
  { href: '/users', label: 'Usuarios', icon: Users },
  { href: '/users/saved', label: 'Guardados', icon: BookmarkCheck, showBadge: true },
  { href: '/posts', label: 'Posts', icon: FileText },
];

export function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();
  const dispatch = useAppDispatch();
  const isSidebarOpen = useAppSelector((s) => s.ui.sidebarOpen);
  const { data: savedUsersData } = useGetSavedUsersQuery({ page: 1, limit: 1 });

  const savedCount = savedUsersData?.meta?.total ?? 0;

  const activeHref = [...navItems]
    .filter((n) => pathname === n.href || pathname.startsWith(n.href + '/'))
    .sort((a, b) => b.href.length - a.href.length)[0]?.href;

  const handleClose = () => dispatch(closeSidebar());

  return (
    <>
      <div
        className={cn(
          'fixed inset-0 z-40 bg-black/60 transition-opacity duration-300 lg:hidden',
          isSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        )}
        onClick={handleClose}
        aria-hidden="true"
      />

      <aside
        className={cn(
          'fixed left-0 top-0 h-full z-50 w-64',
          'bg-sidebar border-r border-sidebar-border flex flex-col',
          'transition-transform duration-300 ease-in-out',
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full',
          'lg:relative lg:z-auto lg:h-screen lg:sticky lg:top-0 lg:translate-x-0',
        )}
      >
        <div className="p-6 border-b border-sidebar-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="size-6 text-primary" />
            <h1 className="text-xl font-bold text-sidebar-foreground">PortalApp</h1>
          </div>
          <button
            onClick={handleClose}
            className="lg:hidden rounded-lg p-1 text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors"
            aria-label="Cerrar menú"
          >
            <X className="size-5" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = item.href === activeHref;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleClose}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground',
                )}
              >
                <Icon className="size-5" />
                <span className="flex-1">{item.label}</span>
                {item.showBadge && savedCount > 0 && (
                  <Badge variant="saved" className="ml-auto">
                    {savedCount}
                  </Badge>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          <button
            onClick={logout}
            className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-foreground transition-colors hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
          >
            <LogOut className="size-5" />
            <span>Cerrar sesión</span>
          </button>
        </div>
      </aside>
    </>
  );
}
