import { Injectable } from '@angular/core';
import {
  catchError,
  forkJoin,
  from,
  map,
  mergeMap,
  Observable,
  of,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import { environment } from '../../../../../environments/environment.qa';
import { SecurityUtils } from '../../../../shared/core/utils/security-utils';
import { NotificationService } from '../../../../shared/services/notification/notification.service';
import { AccountDirectoryModel } from '../../model/account-directory.model';
import { AccountModel } from '../../model/account.model';
import { BasicInfoModel } from '../../model/basic-info.model';
import { ContactInfoModel } from '../../model/contact-info.model';
import { EmployeeInfoModel } from '../../model/employee-info.model';
import { ResponseModel } from '../../model/response.model';
import { SignatureInfoModel } from '../../model/signature-info.model';
import { SignatureSecretModel } from '../../model/signature-secret.model';
import { SignatureModel } from '../../model/signature.model';
import { AvatarService } from '../avatar/avatar.service';
import { SignatureService } from '../signature/signature.service';
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root',
})
export class ProcessTransactionCreateService {
  constructor(
    private readonly userService: UserService,
    private readonly avatarService: AvatarService,
    private readonly signatureService: SignatureService,
    private readonly notificationService: NotificationService
  ) {}

  createUser(
    formData: any,
    token: string
  ): Observable<[ResponseModel<string>, ResponseModel<string>] | null> {
    const { basicInfo, contactInfo, employeeInfo, accountInfo, signatureInfo } =
      formData;
      console.log("firma tiene", signatureInfo)
    const models = this.prepareCreateModels(
      basicInfo,
      contactInfo,
      employeeInfo,
      accountInfo,
      signatureInfo,
      token
    );

    return this.validateDocumentAndUserExists(
      models.basicInfo.documentNumber,
      accountInfo.user
    ).pipe(
      // Paso 1: Subir avatar si está presente (opcional)
      switchMap(() => {
        if (!accountInfo.avatarPath) {
          return of({ models, avatarPath: null });
        }
        const fileName =
          `${models.basicInfo.firstName}_${models.basicInfo.documentNumber}`.toLowerCase();
        return this.avatarService
          .uploadAvatar(accountInfo.avatarPath, fileName)
          .pipe(
            tap({
              next: (uploadResponse) =>
                console.log('Respuesta del servicio de avatar:', uploadResponse),
              error: (error) => console.error('Error al subir avatar:', error),
            }),
            map((uploadResponse) => ({
              models,
              avatarPath: uploadResponse?.data ?? null,
            })),
            catchError(() => of({ models, avatarPath: null }))
          );
      }),

      // Paso 2: Crear cuenta
      switchMap(({ models, avatarPath }) => {
        console.log("paso 2 crear cuenta ", accountInfo);
        const accountData = accountInfo.isDirectoryActive
          ? {
              ...models.accountDirectory,
              avatarPath: avatarPath ?? '',
              token,
            }
          : {
              ...models.accountInfo,
              avatarPath: avatarPath ?? '',
              token,
            };
        console.log("rees", accountData);

        const accountCreation$ = accountInfo.isDirectoryActive
          ? this.userService.registerAccountDirectory(accountData)
          : this.userService.registerAccountInfo(accountData);

        return accountCreation$.pipe(
          switchMap((accountResponse) => {
            if (!accountResponse.data) {
              throw new Error('Error creando la cuenta');
            }
            return this.userService.registerBasicInfo(models.basicInfo).pipe(
              map((basicInfoResponse) => ({
                basicInfoResponse,
                userId: accountResponse.data,
                models,
              }))
            );
          })
        );
      }),

      // Paso 3: Registrar contacto, empleado y firma (si existe)
      switchMap(({ basicInfoResponse, userId, models }) => {
        if (!basicInfoResponse.data) {
          throw new Error('Error creando información básica');
        }

        const personId = basicInfoResponse.data;
        const updatedModels = this.updateModelsWithIds(
          models,
          personId,
          userId
        );

        // Operaciones base
        const operations: Observable<any>[] = [
          this.userService.registerContactInfo(updatedModels.contactInfo),
          this.userService.registerEmployeeInfo(updatedModels.employeeInfo),
        ];

        // Añadir firma si existe y es válida
        if (this.hasValidSignature(signatureInfo)) {
          operations.push(
            this.handleSignatureCreation(
              signatureInfo,
              models.basicInfo,
              personId
            ).pipe(
              map((success) => {
                if (!success) {
                  console.error('Error al crear la firma');
                }
                return success;
              }),
              catchError((error) => {
                console.error('Error en el proceso de firma:', error);
                return of(false);
              })
            )
          );
        }

        return forkJoin(operations).pipe(
          map((results) => {
            // Filtrar la respuesta de la firma si existe
            const filteredResults = results.slice(0, 2);
            return filteredResults as [
              ResponseModel<string>,
              ResponseModel<string>
            ];
          })
        );
      }),
      catchError((error) => this.handleCreationError(error))
    );
  }

  private handleCreationError(error: any): Observable<null> {
    console.error('Error creando usuario:', error);
    const errorMessage = error.message ?? 'Error al crear usuario';
    const displayMessage =
      errorMessage.includes('documento') || errorMessage.includes('usuario')
        ? errorMessage
        : 'Error en el proceso de creación';

    this.notificationService.showError(displayMessage);
    return of(null);
  }

  // paso 1 validar si viene una imagen este viene como file
  private hasValidSignature(signatureInfo: SignatureInfoModel): boolean {
    return (
      !!signatureInfo?.password?.trim() &&
      (!!signatureInfo.signatureImageMechanic?.trim() ||
        !!signatureInfo.signatureImageDigital?.trim() ||
        !!signatureInfo.signatureImageRubric?.trim())
    );
  }

  // paso 2
  private handleSignatureCreation(
    signatureInfo: SignatureInfoModel,
    basicInfo: BasicInfoModel,
    personId: string
  ): Observable<boolean> {
    // si es rubirca quiere decir que viene con contraseña la imagen asi que
    // hashea la contraseña
    // la imagen debe de estar en base 64
    return from(SecurityUtils.hasPassword(signatureInfo.password)).pipe(
      mergeMap((passwordHash) => {
        const signatureOperations = [];

        if (signatureInfo.signatureImageMechanic?.trim()) {
          signatureOperations.push(
            this.createSignature(
              'MECHANIC',
              signatureInfo.signatureImageMechanic,
              basicInfo,
              personId,
            )
          );
        }

        if (signatureInfo.signatureImageDigital?.trim()) {
          signatureOperations.push(
            this.createSignature(
              'DIGITAL',
              signatureInfo.signatureImageDigital,
              basicInfo,
              personId,
            )
          );
        }

        if (signatureInfo.signatureImageRubric?.trim()) {
          signatureOperations.push(
            this.createSignature(
              'RUBRIC',
              signatureInfo.signatureImageRubric,
              basicInfo,
              personId,
              passwordHash
            )
          );
        }

        return signatureOperations.length > 0
          ? forkJoin(signatureOperations).pipe(map(() => true))
          : of(false);
      }),
      catchError(() => of(false))
    );
  }

  // paso 3 genera el djson que se va a enviar como quedaria mi codigo
  private createSignature(
    type: string,
    image: string,
    basicInfo: BasicInfoModel,
    personId: string,
    passwordHash?: string
  ): Observable<any> {
    const signatureSecret: SignatureSecretModel = {
      compartmentId: environment.COMPARTMENT_ID,
      vaultId: environment.VAULT_ID,
      keyId: environment.KEY_ID,
      content: {
        value: image,
        status: 'active',
        passwordHash: passwordHash,
      },
      contentName: `${basicInfo.firstName}_${type}`,
      description: `${basicInfo.firstName} ${basicInfo.lastName} - ${type}`,
      secretName: `${basicInfo.documentNumber}_${type}`,
    };

    const signature: SignatureModel = {
      idPerson: personId,
      type: type,
      value: image,
    };

    return this.signatureService.createSignatureWithSecret(
      signatureSecret,
      signature
    );
  }

  private validateDocumentAndUserExists(
    documentNumber: string,
    userName: string
  ): Observable<void> {
    return forkJoin({
      documentCheck: this.userService.getUserByDocument(documentNumber),
      userNameCheck: this.userService.getUserByUserName(userName),
    }).pipe(
      switchMap((results) => {
        // Verificamos si el documento ya existe
        if (results.documentCheck) {
          return throwError(() => 'Documento ya existe');
        }
        console.log('el documento es valido pasa a validar el user');
        // Verificamos si el nombre de usuario ya existe
        if (results.userNameCheck) {
          return throwError(() => 'Usuario ya existe');
        }

        // Si ambas validaciones pasan, retornamos un Observable que completa exitosamente
        return of(undefined);
      })
    );
  }

  private prepareCreateModels(
    basicInfo: any,
    contactInfo: any,
    employeeInfo: any,
    accountInfo: any,
    signatureInfo: any,
    token: string
  ): any {
    console.log("roles reusl",this.createAccountInfoModel(basicInfo, accountInfo, token))
    return {
      basicInfo: this.createBasicInfoModel(basicInfo),
      contactInfo: this.createContactInfoModel(contactInfo),
      employeeInfo: this.createEmployeeInfoModel(employeeInfo),
      signatureInfo: this.createSignatureInfoModel(signatureInfo),
      accountInfo: this.createAccountInfoModel(basicInfo, accountInfo, token),
      accountDirectory: this.createAccountDirectoryModel(
        employeeInfo,
        accountInfo,
        token
      ),
    };
  }

  private createBasicInfoModel(data: any): Omit<BasicInfoModel, 'id'> {
    return {
      documentType: data.documentType,
      documentNumber: data.documentNumber,
      firstName: data.firstName,
      middleName: data.middleName,
      lastName: data.lastName,
      secondLastName: data.secondLastName,
    };
  }

  private createContactInfoModel(data: any): Omit<ContactInfoModel, 'id'> {
    return {
      idPerson: '',
      email: data.email,
      phone: data.phone,
      address: data.address,
    };
  }

  private createEmployeeInfoModel(data: any): Omit<EmployeeInfoModel, 'id'> {
    return {
      bussinesEmail: data.bussinesEmail,
      bussinesPhone: data.bussinesPhone,
      idPerson: '',
      idUser: '',
    };
  }

  private createAccountInfoModel(
    basicInfo: any,
    accountInfo: any,
    token: string
  ): Omit<AccountModel, 'id'> {
    return {
      avatarPath: accountInfo.avatarPath ?? 'default',
      middleName: basicInfo.middleName,
      firstName: basicInfo.firstName,
      lastName: basicInfo.lastName,
      secondLastName: basicInfo.secondLastName,
      businessEmail: accountInfo.user,
      password: accountInfo.password,
      roles: [accountInfo.role],
      token,
    };
  }

  private createAccountDirectoryModel(
    employeeInfo: any,
    accountInfo: any,
    token: string
  ): AccountDirectoryModel {
    return {
      avatarPath: accountInfo.avatarPath ?? 'default',
      userName: employeeInfo.bussinesEmail,
      roles: [accountInfo.role],
      token,
    };
  }

  private createSignatureInfoModel(data: any): SignatureInfoModel {
    return {
      password: '',
      signatureImageDigital: '',
      signatureImageMechanic: '',
      signatureImageRubric: '',
    };
  }

  private updateModelsWithIds(
    models: any,
    personId: string,
    userId: string
  ): any {
    return {
      ...models,
      contactInfo: { ...models.contactInfo, idPerson: personId },
      employeeInfo: {
        ...models.employeeInfo,
        idPerson: personId,
        idUser: userId,
      },
    };
  }
}
