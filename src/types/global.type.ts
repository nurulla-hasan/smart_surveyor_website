export type QueryParams = { [key: string]: string | string[] | undefined };
export type SearchParams = Promise<QueryParams>;

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}