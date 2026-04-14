import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store';
import { setCredentials, logout as logoutAction } from '@/store/slices/authSlice';

export function useAuth() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { token, isAuthenticated } = useAppSelector((s) => s.auth);

  const login = useCallback(
    (token: string) => {
      dispatch(setCredentials({ token }));
      router.push('/users');
    },
    [dispatch, router],
  );

  const logout = useCallback(() => {
    dispatch(logoutAction());
    router.push('/login');
  }, [dispatch, router]);

  return { token, isAuthenticated, login, logout };
}
