import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';
import { ApiResponse } from '../../../../shared/interfaces/api-response';
import { Contact } from '../../../../shared/interfaces/contact.model';
import { Person } from '../../../../shared/interfaces/person.model';
import { UserModel } from '../../../../shared/interfaces/user.model';
import { Config } from '../../../../shared/core/config';
import { EmployeeInfoModel } from '../../../create/model/employee-info.model';
import { CombinedUserInfo } from '../../interfaces/combine-user-info';

// Función para headers repetidos
export const getCommonHeaders = (): HttpHeaders => {
  return new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${Config.TOKEN}`
  });
};

// Función genérica para búsquedas
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
    headers: getCommonHeaders(),
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

// Helper para combinar datos de usuario
export const combineUserData = (
  person: Person,
  employees: EmployeeInfoModel,
  users: UserModel,
  contacts: Contact
): CombinedUserInfo => {
 /* const employee = employees.find(e => e.idPerson === person.id) ?? null;
  const user = employee ? users.find(u => u.id === employee.idUser) ?? null : null;
  const contact = contacts.find(c => c.idPerson === person.id) ?? null;
*/
  return {
    person: { ...person },
    employee:  { ...employees } ,
    user: { ...users } ,
    contact:  { ...contacts }
  };
};

// Función genérica para obtener entidades por ID
export const getById = <T>(
  http: HttpClient,
  url: string,
  id: string,
  idParamName: string = 'id'
): Observable<T | null> => {
  return http
    .get<ApiResponse<T>>(`${url}?${idParamName}=${id}`, {
      headers: getCommonHeaders(),
    })
    .pipe(
      map((res) => res.data?.items?.[0] || null),
      catchError((error) => {
        console.error(`Error fetching ${url.split('/').pop()}`, error);
        return of(null);
      })
    );
};

// Función genérica para actualizaciones PUT
export const putApiData = <T>(
  url: string,
  body: any,
  httpClient: HttpClient
): Observable<ApiResponse<T>> => {
  return httpClient.put<ApiResponse<T>>(url, body, {
    headers: getCommonHeaders()
  }).pipe(
    catchError(error => {
      console.error(`Error updating data at ${url}:`, error);
      return of({
        data: { items: [], totalCount: 0, pageNumber: 1, pageSize: 10 },
        errors: [error],
        statusCode: 500
      });
    })
  );
};
