import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';
import { ApiResponse } from '../../interfaces/api-response';

// Función genérica para obtener entidades por ID
export const getById = <T>(
  http: HttpClient,
  url: string,
): Observable<T | null> => {
  return http
    .get<ApiResponse<T>>(`https://localhost:32769/api/v1/users/get_by_filter?userId=c8be9dfa-6610-4638-bff5-2669176024da`, {
    })
    .pipe(
      map((res) => res.data?.items?.[0] || null),
      catchError((error) => {
        console.error(`Error fetching ${url.split('/').pop()}`, error);
        return of(null);
      })
    );
};


export const fetchApiData = <T>(
  url: string,
  params: any,
  httpClient: HttpClient,
  useApiResponse: boolean = true
): Observable<ApiResponse<T>> => {
  type ResponseType = typeof useApiResponse extends true
    ? ApiResponse<T>
    : T[];

  return httpClient.get<ResponseType>(url, {
    params
  }).pipe(
    map(response => {
      if (useApiResponse) {
        return response as unknown as ApiResponse<T>;
      }
      return {
        data: {
          items: response,
          totalCount: (response as any).totalCount ?? (response).length,
          pageNumber: (response as any).pageNumber ?? 1,
          pageSize: (response as any).pageSize ?? 100
        },
        errors: [],
        statusCode: 200
      };
    }),
    catchError(error => {
      console.error(`Error fetching data from ${url}:`, error);
      return of({
        data: {
          items: [],
          totalCount: 0,
          pageNumber: 1,
          pageSize: 100
        },
        errors: [error],
        statusCode: 500
      });
    })
  );
};
