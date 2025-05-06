import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, forkJoin, map, of, throwError } from 'rxjs';
import { Config } from '../../../../shared/core/config';
import { AccountModel } from '../../model/account.model';
import { BasicInfoModel } from '../../model/basic-info.model';
import { ContactInfoModel } from '../../model/contact-info.model';
import { EmployeeInfoModel } from '../../model/employee-info.model';
import { ResponseModel } from '../../model/response.model';
import { ResponseUser } from '../../model/responseUser';
import { NotificationService } from '../../../../shared/services/notification/notification.service';
import { AccountDirectoryModel } from '../../model/account-directory.model';
import { EndPoints } from '../../../../shared/core/endpoints';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly notificationService = inject(NotificationService);

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${Config.TOKEN}`,
    });
  }

  /**
   * Registra la información básica de una persona
   * @param basicInfo Datos básicos del usuario
   * @returns Observable con la respuesta del servidor
   */
  registerBasicInfo(basicInfo: Omit<BasicInfoModel, 'id'>): Observable<ResponseModel<string>> {
    console.log("basico", basicInfo)
    return this.http
      .post<ResponseModel<string>>(EndPoints.CREATE_PEOPLE, basicInfo, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError.bind(this)));
  }

  /**
   * Registra la información de contacto de una persona
   * @param contactInfo Datos de contacto del usuario
   * @returns Observable con la respuesta del servidor
   */
  registerContactInfo(
    contactInfo: Omit<ContactInfoModel, 'id'>
  ): Observable<ResponseModel<string>> {
    console.log("contacto", contactInfo)
    return this.http
      .post<ResponseModel<string>>(EndPoints.CREATE_CONTACT, contactInfo, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError.bind(this)));
  }

  /**
   * Registra la información de empleado
   * @param employeeInfo Datos del empleado
   * @returns Observable con la respuesta del servidor
   */
  registerEmployeeInfo(
    employeeInfo: Omit<EmployeeInfoModel, 'id'>
  ): Observable<ResponseModel<string>> {

    return this.http
      .post<ResponseModel<string>>(EndPoints.CREATE_EMPLOYEE, employeeInfo, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError.bind(this)));
  }

  /**
   * Registra la información de cuenta de usuario
   * @param accountInfo Datos de la cuenta
   * @returns Observable con la respuesta del servidor
   */
  registerAccountInfo(
    accountInfo: Omit<AccountModel, 'id'>
  ): Observable<ResponseModel<any>> {
    return this.http
      .post<ResponseModel<any>>(EndPoints.CREATE_ACCOUNT, accountInfo, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError.bind(this)));
  }

  registerAccountDirectory(
    accountInfo:  AccountDirectoryModel
  ): Observable<ResponseModel<any>> {
    return this.http
      .post<ResponseModel<any>>(EndPoints.CREATE_ACCOUNT_WITH_DIRECTORY, accountInfo, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError.bind(this)));
  }

  /**
   * Registra un usuario completo (todas las etapas)
   * @param basicInfo Información básica
   * @param contactInfo Información de contacto
   * @param employeeInfo Información de empleado
   * @param accountInfo Información de cuenta
   * @returns Observable con el resultado completo
   */
  registerCompleteUser(
    basicInfo: BasicInfoModel,
    contactInfo: ContactInfoModel,
    employeeInfo: EmployeeInfoModel,
    accountInfo: AccountModel
  ): Observable<ResponseModel<any>[]> {
    return forkJoin([
      this.registerBasicInfo(basicInfo),
      this.registerContactInfo(contactInfo),
      this.registerEmployeeInfo(employeeInfo),
      this.registerAccountInfo(accountInfo),
    ]).pipe(catchError(this.handleError.bind(this)));
  }

  getUserByDocument(documentNumber: string): Observable<boolean> {
    const url = `${EndPoints.GET_USER_BY_DOCUMENT}?documentNumber=${documentNumber}`;
    return this.http
      .get<ResponseModel<ResponseUser>>(url, { headers: this.getHeaders() })
      .pipe(
        map((response) => {
          return response?.data?.items?.length > 0;
        }),
        catchError((error) => {
          console.error('Error buscando usuario por documento:', error);
          return of(false);
        })
      );
}

getUserByUserName(userName: string): Observable<boolean> {
    const url = `${EndPoints.GET_USER}?userName=${userName}`; // Asegúrate que este endpoint es correcto
    return this.http
      .get<ResponseModel<ResponseUser>>(url, { headers: this.getHeaders() })
      .pipe(
        map((response) => {
          return response?.data?.items?.length > 0;
        }),
        catchError((error) => {
          console.error('Error buscando usuario por nombre:', error);
          return of(false);
        })
      );
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
      if (error.error?.error) {
        // Si el servidor devuelve un array de errores en el formato ResponseModel
        errorMessage = error.error.error
          .map((err: any) => err.message ?? JSON.stringify(err))
          .join('\n');
      } else {
        errorMessage = `Código de error: ${error.status}\nMensaje: ${error.message}`;
      }
    }

    this.notificationService.showError(errorMessage);
    console.error(errorMessage, error);
    return throwError(() => new Error(errorMessage));
  }

  updateCompleteUser(
    basicInfo: BasicInfoModel,
    contactInfo: ContactInfoModel,
    employeeInfo: EmployeeInfoModel,
    accountInfo: AccountModel,
    ids: {
      idPerson: string;
      idContact: string;
      idEmployee: string;
      idUser: string;
    }
  ): Observable<ResponseModel<any>[]> {
    return forkJoin([
      this.updateBasicInfo(basicInfo, ids.idPerson),
      this.updateContactInfo(contactInfo, ids.idContact),
      this.updateEmployeeInfo(employeeInfo, ids.idEmployee),
      this.updateAccountInfo(accountInfo, ids.idUser),
    ]).pipe(catchError(this.handleError.bind(this)));
  }

  updateBasicInfo(basicInfo: BasicInfoModel, idPerson: string): Observable<ResponseModel<string>> {
    return this.http.put<ResponseModel<string>>(
      EndPoints.UPDATE_PEOPLE,
      { ...basicInfo, idPerson }
    );
  }

  updateContactInfo(contactInfo: ContactInfoModel, idContact: string): Observable<ResponseModel<string>> {
    return this.http.put<ResponseModel<string>>(
      EndPoints.UPDATE_CONTACT,
      { ...contactInfo, idContact }
    );
  }

  updateEmployeeInfo(employeeInfo: EmployeeInfoModel, idEmployee: string): Observable<ResponseModel<string>> {
    return this.http.put<ResponseModel<string>>(
      EndPoints.UPDATE_EMPLOYEE,
      { ...employeeInfo, idEmployee }
    );
  }

  updateAccountInfo(accountInfo: AccountModel, idUser: string): Observable<ResponseModel<string>> {
    return this.http.put<ResponseModel<string>>(
      EndPoints.UPDATE_USERS,
      { ...accountInfo, idUser }
    );
  }

}

export interface CompleteUser {
  person: BasicInfoModel;
  contact: ContactInfoModel;
  employee: EmployeeInfoModel;
  user: AccountModel | null;
}
