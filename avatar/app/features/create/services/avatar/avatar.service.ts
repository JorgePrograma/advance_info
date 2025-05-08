import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { NotificationService } from '../../../../shared/services/notification/notification.service';
import { ResponseModel } from '../../model/response.model';
import { EndPoints } from '../../../../shared/core/endpoints';

@Injectable({
  providedIn: 'root',
})
export class AvatarService {
  private readonly http = inject(HttpClient);
  private readonly notificationService = inject(NotificationService);

  // URL completa del endpoint desde environment
  private readonly AVATAR_UPLOAD_URL = `${EndPoints.CREATE_AVATAR}`;

  uploadAvatar(file: File, name:string): Observable<ResponseModel<any>> {
    const formData = new FormData();

    // Parámetros requeridos según la documentación del endpoint
    formData.append('NamespaceName', "axzcnvxafjzw");
    formData.append('BucketName', "bucket-avatar-users");
    formData.append('ObjectName', name);
    formData.append('ContentType', file.type);
    formData.append('File', file, file.name);

    return this.http.post<ResponseModel<any>>(this.AVATAR_UPLOAD_URL, formData)
      .pipe(
        catchError(this.handleError.bind(this))
      );
  }

  private generateUniqueFileName(originalName: string): string {
    const timestamp = new Date().getTime();
    const extension = originalName.split('.').pop();
    return `avatar_${timestamp}.${extension}`;
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Error al subir el archivo';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = error.error?.message || `Código: ${error.status} - Mensaje: ${error.message}`;
    }

    this.notificationService.showError(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
