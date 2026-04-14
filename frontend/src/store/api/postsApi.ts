import { baseApi } from './baseApi';
import type { PaginatedResponse } from './usersApi';

export interface Post {
  id: string;
  title: string;
  content: string;
  authorUserId: number | null;
  reqresAuthorId: number | null;
  author: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    avatar: string | null;
  } | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePostDto {
  title: string;
  content: string;
  authorUserId?: number;
  reqresAuthorId?: number;
}

export type UpdatePostDto = Partial<CreatePostDto>;

export interface FindPostsParams {
  page?: number;
  limit?: number;
  search?: string;
  authorUserId?: number;
  reqresAuthorId?: number;
  orderBy?: 'newest' | 'oldest' | 'title';
}

export const postsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPosts: builder.query<PaginatedResponse<Post>, FindPostsParams>({
      query: (params) => ({
        url: '/posts',
        params,
      }),
      providesTags: ['Post'],
    }),

    getPost: builder.query<{ data: Post }, string>({
      query: (id) => `/posts/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Post', id }],
    }),

    createPost: builder.mutation<{ data: Post }, CreatePostDto>({
      query: (body) => ({ url: '/posts', method: 'POST', body }),
      invalidatesTags: ['Post'],
    }),

    updatePost: builder.mutation<{ data: Post }, { id: string; body: UpdatePostDto }>({
      query: ({ id, body }) => ({ url: `/posts/${id}`, method: 'PUT', body }),
      invalidatesTags: (_result, _error, { id }) => ['Post', { type: 'Post', id }],
    }),

    deletePost: builder.mutation<void, string>({
      query: (id) => ({ url: `/posts/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Post'],
    }),
  }),
});

export const {
  useGetPostsQuery,
  useGetPostQuery,
  useCreatePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
} = postsApi;
