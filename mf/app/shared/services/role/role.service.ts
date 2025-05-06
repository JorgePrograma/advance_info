import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { Config } from '../../core/config';
import { Role } from '../../../features/create/model/role.model';
import { EndPoints } from '../../core/endpoints';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  // Señal privada para el estado interno
  private readonly _roles = signal<Role[]>([]);

  // Señal pública de solo lectura
  public readonly rolesSignal = this._roles.asReadonly();

  constructor(private readonly http: HttpClient) {}
  private readonly authToken = Config.TOKEN;

  getAllRoles(): Observable<Role[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.authToken}`,
    });

    return this.http.get<any>(EndPoints.GET_ALL_ROLES, { headers }).pipe(
      map((response) => {
        try {
          return response ?? [];
        } catch (error) {
          console.error('Error parseando JSON:', error);
          return [];
        }
      }),
      tap((roles) => {
        this._roles.set(roles);
      }),
      catchError((error) => {
        console.error('Error en la solicitud HTTP:', error);
        return of([]);
      })
    );
  }
}
