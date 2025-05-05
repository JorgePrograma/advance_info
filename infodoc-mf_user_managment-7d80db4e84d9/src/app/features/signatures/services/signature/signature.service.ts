// signature.service.ts
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { Config } from '../../../../shared/core/config';
import { NotificationService } from '../../../../shared/services/notification/notification.service';
import { EndPoints } from '../../../../shared/core/endpoints';
import { SignatureType } from '../../component/signature-card/SignatureType';
import { ResponseModel } from '../../../create/model/response.model';
import { SignatureModel } from '../../interfaces/signature.model';

@Injectable({
  providedIn: 'root',
})
export class SignatureService {
  private readonly http = inject(HttpClient);
  private readonly notificationService = inject(NotificationService);

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${Config.TOKEN}`,
    });
  }

  uploadSignature(
    formData: FormData,
    type: SignatureType
  ): Observable<ResponseModel<SignatureModel>> {
    const endpoint =
      type === 'digital'
        ? EndPoints.UPLOAD_DIGITAL_SIGNATURE
        : EndPoints.UPLOAD_RUBRICA_SIGNATURE;

    return this.http
      .post<ResponseModel<SignatureModel>>(endpoint, formData, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError.bind(this)));
  }

  deleteSignature(signatureId: string): Observable<ResponseModel<boolean>> {
    return this.http
      .delete<ResponseModel<boolean>>(
        `${EndPoints.DELETE_SIGNATURE}/${signatureId}`,
        { headers: this.getHeaders() }
      )
      .pipe(catchError(this.handleError.bind(this)));
  }

  getUserSignatures(
    userId: string
  ): Observable<ResponseModel<SignatureModel[]>> {
    return this.http
      .get<ResponseModel<SignatureModel[]>>(
        `${EndPoints.GET_USER_SIGNATURES}/${userId}`,
        { headers: this.getHeaders() }
      )
      .pipe(catchError(this.handleError.bind(this)));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Error en el servicio de firmas';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage =
        error.error?.message ??
        `Código: ${error.status} - Mensaje: ${error.message}`;
    }

    this.notificationService.showError(errorMessage);
    console.error('Error en SignatureService:', error);
    return throwError(() => new Error(errorMessage));
  }
}
