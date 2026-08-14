export interface PaginatedResult<T> {
  items: T[];
  nextOffset?: number;
}

export function hasMore<T>(result: PaginatedResult<T>): boolean {
  return result.nextOffset !== undefined;
}
