import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Role } from '../../interfaces/user.model';

// Si tienes un modelo para el rol, reemplaza 'any' por tu interfaz, por ejemplo: RoleModel
@Injectable({
  providedIn: 'root'
})
export class RolesService {
  private readonly http = inject(HttpClient);

  // Puedes parametrizar la URL base si lo necesitas
  private readonly baseUrl = 'https://ib3m6t7bp7sjmglwvvpg3xrmzu.apigateway.sa-bogota-1.oci.customer-oci.com/api/v1/role';


  getRoleById(id: string): Observable<any | null> {
    console.log('Fetching role by ID:', id);
    const url = `https://ib3m6t7bp7sjmglwvvpg3xrmzu.apigateway.sa-bogota-1.oci.customer-oci.com/api/v1/role/role-get-by-id/93264215-9e3c-4917-8dd6-061d9ddccd03`;
    return this.http.get<any>(url).pipe(
      map(res => res, null),
      catchError(error => {
        console.error('Error fetching role:', error);
        return of(null);
      })
    );
  }
}
