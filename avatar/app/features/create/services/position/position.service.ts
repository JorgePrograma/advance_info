import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Config } from '../../../../shared/core/config';
import { PositionModel } from '../../model/position.model';
import { EndPoints } from '../../../../shared/core/endpoints';

@Injectable({
  providedIn: 'root',
})
export class PositionService {
  // Signal para manejar el estado reactivo de los tipos de documentos
  private readonly _positions = signal<PositionModel[]>([]);
  positionSignal = this._positions.asReadonly();
  constructor(private readonly http: HttpClient) {}
  private readonly authToken = Config.TOKEN;

  /**
   * Obtiene todos los tipos de documentos.
   */

  getPosition(): Observable<PositionModel[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.authToken}`,
    });

    return this.http.get<any>(EndPoints.GET_ALL_POSITION, {headers}).pipe(
      map((response) => {
        try {
          return response ?? [];
        } catch (error) {
          return [];
        }
      }),
      tap(position =>{
        this._positions.set(position)
      }),
      catchError((error) => {
        return of([]);
      })
    );
  }
}
