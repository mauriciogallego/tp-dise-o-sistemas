import { IPaginatedResult } from '@src/interfaces/types';

export class PaginatedResult<T> implements IPaginatedResult<T> {
  results: T[];
  pagination: {
    total: number | undefined;
    size: number;
    skip: number;
    take: number;
    hasMore?: boolean;
  };
}
