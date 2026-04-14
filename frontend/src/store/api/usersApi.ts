import { baseApi } from './baseApi';

export interface ReqresUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
  isSaved: boolean;
  localId: number | null;
}

export interface ReqresUsersResponse {
  data: ReqresUser[];
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
}

export interface SavedUser {
  id: number;
  reqresId: number;
  email: string;
  firstName: string;
  lastName: string;
  avatar: string | null;
  createdAt: string;
  alreadyExisted: boolean;
  postCount?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    timestamp: string;
    requestId?: string;
  };
}

export interface ImportUserResponse {
  data: SavedUser;
  meta: { timestamp: string; requestId: string };
}

export const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<
      { data: { token: string } },
      { email: string; password: string }
    >({
      query: (body) => ({ url: '/auth/login', method: 'POST', body }),
    }),

    getReqresUsers: builder.query<ReqresUsersResponse, number>({
      query: (page) => `/users?page=${page}`,
      providesTags: ['ReqresUsers'],
    }),

    getReqresUser: builder.query<{ data: ReqresUser }, number>({
      query: (reqresId) => `/users/reqres/${reqresId}`,
    }),

    importUser: builder.mutation<ImportUserResponse, number>({
      query: (reqresId) => ({
        url: `/users/import/${reqresId}`,
        method: 'POST',
      }),
      invalidatesTags: ['SavedUser', 'ReqresUsers'],
    }),

    getSavedUsers: builder.query<
      PaginatedResponse<SavedUser>,
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 10 } = {}) =>
        `/users/saved?page=${page}&limit=${limit}`,
      providesTags: ['SavedUser'],
    }),

    getSavedUser: builder.query<{ data: SavedUser }, number>({
      query: (id) => `/users/saved/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'SavedUser', id }],
    }),

    deleteSavedUser: builder.mutation<void, number>({
      query: (id) => ({ url: `/users/saved/${id}`, method: 'DELETE' }),
      invalidatesTags: ['SavedUser', 'ReqresUsers'],
    }),
  }),
});

export const {
  useLoginMutation,
  useGetReqresUsersQuery,
  useGetReqresUserQuery,
  useImportUserMutation,
  useGetSavedUsersQuery,
  useGetSavedUserQuery,
  useDeleteSavedUserMutation,
} = usersApi;
