import { inject, Injectable } from '@angular/core';
import { Config } from '../../../../shared/core/config';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { ResponseModel } from '../../model/response.model';
import { Response2Model } from '../../model/response2.model';
import { EndPoints } from '../../../../shared/core/endpoints';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);

  getToken(): string {
    return Config.TOKEN;
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    return true;
  }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${Config.TOKEN}`,
    });
  }

  generateTokenForUser(): Observable<Response2Model<string>> {
    return this.http
      .post<Response2Model<string>>(
        EndPoints.GENERATE_AUTH_FOR_USER,
        {
          scope: 'urn:opc:idm:__myscopes__',
          grantType: 'client_credentials',
        },
        {
          headers: this.getHeaders(),
        }
      )
      .pipe(catchError(this.handleError.bind(this)));
  }

    /**
   * Maneja errores HTTP y de servidor
   * @param error Error recibido
   * @returns Observable que emite el error
   */
    handleError(error: HttpErrorResponse): Observable<never> {
      let errorMessage = 'Ocurrió un error desconocido';

      if (error.error instanceof ErrorEvent) {
        // Error del lado del cliente
        errorMessage = `Error: ${error.error.message}`;
      } else {
        // Error del lado del servidor
        if (error.error && error.error.error) {
          // Si el servidor devuelve un array de errores en el formato ResponseModel
          errorMessage = error.error.error
            .map((err: any) => err.message || JSON.stringify(err))
            .join('\n');
        } else {
          errorMessage = `Código de error: ${error.status}\nMensaje: ${error.message}`;
        }
      }

      return throwError(() => new Error(errorMessage));
    }
}
