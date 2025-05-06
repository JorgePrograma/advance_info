import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { GroupModel } from '../../../features/create/model/group.model';
import { Config } from '../../core/config';
import { EndPoints } from '../../core/endpoints';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  constructor(private readonly http: HttpClient) { }

  private readonly _groupSignal = signal<GroupModel[]>([]);

  public readonly groupSignal = this._groupSignal.asReadonly();
  private readonly authToken = Config.TOKEN;

  /**
   * Obtiene los grupos desde el API y actualiza la señal
   * @returns Observable con los datos de grupos
   */
  getGroups(): Observable<GroupModel[]> {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.authToken}`
    });

    return this.http.get<any>(EndPoints.GET_ALL_GROUPS, {headers}).pipe(
      map(response => {
        try {
          this._groupSignal.set(response);
          return response ?? [];
        } catch (error) {
          console.error('Error parseando JSON:', error);
          return [];
        }
      }),
      catchError(error => {
        console.error('Error en la solicitud HTTP:', error);
        return of([]);
      })
    );
  }

asociateUserGroups(): Observable<GroupModel[]> {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.authToken}`
    });

    return this.http.get<any>(EndPoints.GET_ALL_GROUPS, {headers}).pipe(
      map(response => {
        try {
          this._groupSignal.set(response);
          return response ?? [];
        } catch (error) {
          console.error('Error parseando JSON:', error);
          return [];
        }
      }),
      catchError(error => {
        console.error('Error en la solicitud HTTP:', error);
        return of([]);
      })
    );
  }
  }
