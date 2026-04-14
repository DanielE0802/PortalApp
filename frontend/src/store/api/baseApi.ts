import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../index';

/**
 * API base con RTK Query.
 *
 * - Inyecta automáticamente el Bearer token en cada request.
 * - Define los tag types para invalidación de cache.
 * - Los módulos (usersApi, postsApi) usan injectEndpoints para extender esta API.
 *
 * IMPORTANTE: Solo hay UNA instancia de createApi (baseApi).
 * usersApi y postsApi inyectan endpoints, NO crean APIs separadas.
 */
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL + '/' + process.env.NEXT_PUBLIC_API_VERSION,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['ReqresUsers', 'SavedUser', 'Post'],
  endpoints: () => ({}),
});
