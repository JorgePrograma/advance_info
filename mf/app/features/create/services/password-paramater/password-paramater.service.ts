import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { PasswordParamater, passwordParamaterSignal } from '../../model/password-paramater.model';
import { EndPoints } from '../../../../shared/core/endpoints';

@Injectable({
  providedIn: 'root'
})
export class PasswordParamaterService {
  private readonly http = inject(HttpClient);

  loadAllData(): Observable<PasswordParamater> {
    return this.http.get<PasswordParamater>(EndPoints.PASSORD_PARAMATER).pipe(
      tap(response => {
        passwordParamaterSignal.set(response);
        console.log('Acciones con detalles:', response);
      }),
      catchError(error => {
        console.error('Error:', error);
        return of({} as PasswordParamater);
      })
    );
  }
}
