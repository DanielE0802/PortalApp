/**
 * Standard API response structure for successful requests.
 */
export interface ApiResponse<T> {
  data: T;
  meta: ApiMeta;
}

/**
 * Metadata included in all API responses.
 */
export interface ApiMeta {
  timestamp: string;
  requestId?: string;
}

/**
 * Standard API response structure for paginated list endpoints.
 */
export interface PaginatedApiResponse<T> {
  data: T[];
  meta: PaginatedMeta;
}

/**
 * Extended metadata for paginated responses.
 */
export interface PaginatedMeta extends ApiMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/**
 * Generic paginated result returned by repository methods.
 */
export interface PaginatedResult<T> {
  data: T[];
  meta: PaginatedMeta;
}

/**
 * Standard error response structure.
 *
 */
export interface ApiErrorResponse {
  error: {
    code: string;
    message: string | string[];
    statusCode: number;
  };
  meta: {
    timestamp: string;
    path: string;
    requestId: string;
  };
}
