'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/store';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, isHydrated } = useAppSelector((s) => s.auth);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    if (isAuthenticated) {
      router.replace('/users');
    } else {
      router.replace('/login');
    }
  }, [isAuthenticated, isHydrated, router]);

  return null;
}
