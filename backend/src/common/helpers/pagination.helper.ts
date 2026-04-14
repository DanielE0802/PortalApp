import { PaginatedMeta } from '../interfaces';

/**
 * Build pagination meta
 *
 * @example
 * const meta = buildPaginationMeta({ page: 1, limit: 10, total: 47 });
 * // { page: 1, limit: 10, total: 47, totalPages: 5, timestamp: '...' }
 */
export function buildPaginationMeta(params: {
  page: number;
  limit: number;
  total: number;
}): PaginatedMeta {
  return {
    page: params.page,
    limit: params.limit,
    total: params.total,
    totalPages: Math.ceil(params.total / params.limit),
    timestamp: new Date().toISOString(),
  };
}
