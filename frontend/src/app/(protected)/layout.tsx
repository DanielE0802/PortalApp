'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/store';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopBar } from '@/components/layout/TopBar';
import { Toaster } from '@/components/ui/Toaster';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, isHydrated } = useAppSelector((s) => s.auth);

  useEffect(() => {
    if (isHydrated && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, isHydrated, router]);

  if (!isHydrated) {
    return <div className="h-screen bg-background" />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto bg-background">
          {children}
        </main>
      </div>
      <Toaster />
    </div>
  );
}
