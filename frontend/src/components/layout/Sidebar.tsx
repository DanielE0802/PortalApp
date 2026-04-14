'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Users, BookmarkCheck, FileText, LogOut, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { useGetSavedUsersQuery } from '@/store/api/usersApi';
import { Badge } from '@/components/ui/Badge';

const navItems = [
  { href: '/users', label: 'Usuarios', icon: Users },
  { href: '/users/saved', label: 'Guardados', icon: BookmarkCheck, showBadge: true },
  { href: '/posts', label: 'Posts', icon: FileText },
];

export function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();
  const { data: savedUsersData } = useGetSavedUsersQuery({ page: 1, limit: 1 });

  const savedCount = savedUsersData?.meta?.total ?? 0;

  const activeHref = [...navItems]
    .filter((n) => pathname === n.href || pathname.startsWith(n.href + '/'))
    .sort((a, b) => b.href.length - a.href.length)[0]?.href;

  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col h-screen sticky top-0">
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <Sparkles className="size-6 text-primary" />
          <h1 className="text-xl font-bold text-sidebar-foreground">PortalApp</h1>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = item.href === activeHref;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
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
  );
}
