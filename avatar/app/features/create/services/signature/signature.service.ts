import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, forkJoin, of, switchMap } from 'rxjs';
import { SignatureModel } from '../../model/signature.model';
import { ResponseModel } from '../../model/response.model';
import { Config } from '../../../../shared/core/config';
import { EndPoints } from '../../../../shared/core/endpoints';
import { SignatureSecretModel } from '../../model/signature-secret.model';

@Injectable({
  providedIn: 'root',
})
export class SignatureService {
  private readonly http = inject(HttpClient);

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${Config.TOKEN}`,
    });
  }

  /**
   * Crea el secreto y la firma en secuencia
   * @returns Tuple con ambas respuestas
   */
  createSignatureWithSecret(
    secretData: SignatureSecretModel,
    signatureData: SignatureModel
  ): Observable<[ResponseModel<string>, ResponseModel<string>]> {
    return this.http
      .post<ResponseModel<string>>(EndPoints.GENERATE_SECRET, secretData, {
        headers: this.getHeaders(),
      })
      .pipe(
        switchMap((secretResponse) =>
          this.http
            .post<ResponseModel<string>>(
              EndPoints.CREATE_SIGNATURE,
              signatureData,
              { headers: this.getHeaders() }
            )
            .pipe(
              switchMap((signatureResponse) =>
                forkJoin([of(secretResponse), of(signatureResponse)])
              )
            )
        )
      );
  }
}
