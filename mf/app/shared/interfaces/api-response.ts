export interface ApiResponse<T> {
  data: {
    items: T[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
  };
  errors: any[];
  statusCode: number;
}
