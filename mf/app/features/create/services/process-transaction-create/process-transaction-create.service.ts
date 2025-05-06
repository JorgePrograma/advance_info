import { Injectable } from '@angular/core';
import { catchError, forkJoin, from, map, mergeMap, Observable, of, switchMap, throwError } from 'rxjs';
import { NotificationService } from '../../../../shared/services/notification/notification.service';
import { AccountDirectoryModel } from '../../model/account-directory.model';
import { AccountModel } from '../../model/account.model';
import { BasicInfoModel } from '../../model/basic-info.model';
import { ContactInfoModel } from '../../model/contact-info.model';
import { EmployeeInfoModel } from '../../model/employee-info.model';
import { ResponseModel } from '../../model/response.model';
import { SignatureInfoModel } from '../../model/signature-info.model';
import { SignatureService } from '../signature/signature.service';
import { UserService } from '../user/user.service';
import { SignatureModel } from '../../model/signature.model';
import { SignatureSecretModel } from '../../model/signature-secret.model';
import { environment } from '../../../../../environments/environment.qa';
import { SecurityUtils } from '../../../../shared/core/utils/security-utils';
import { ImageUtils } from '../../../../shared/core/utils/image-utils';

@Injectable({
  providedIn: 'root',
})
export class ProcessTransactionCreateService {
  constructor(
    private readonly userService: UserService,
    private readonly signatureService: SignatureService,
    private readonly notificationService: NotificationService
  ) {}

  createUser(
    formData: any,
    token: string
  ): Observable<[ResponseModel<string>, ResponseModel<string>, ResponseModel<boolean>] | null> {
    const { basicInfo, contactInfo, employeeInfo, accountInfo, signatureInfo } =
      formData;
  
    const models = this.prepareCreateModels(
      basicInfo,
      contactInfo,
      employeeInfo,
      accountInfo,
      signatureInfo,
      token
    );
  
    return this.userService.getUserByDocument(models.basicInfo.documentNumber).pipe(
      switchMap((user) => {
        if (user) {
          this.notificationService.showError('Ya existe un usuario con ese documento');
          return throwError(() => 'Usuario ya existe');
        }
        return this.userService.getUserByUserName(accountInfo.user);
      }),
      switchMap((userByUsername) => {
        if (userByUsername) {
          this.notificationService.showError('Ya existe un usuario con ese user');
          return throwError(() => 'Usuario ya existe');
        }
        
        return this.userService.registerBasicInfo(models.basicInfo).pipe(
          switchMap((basicInfoResponse) => {
            if (!basicInfoResponse.data) {
              throw new Error('Error creating person');
            }
            const personId = basicInfoResponse.data;
            
            const accountCreation$ = accountInfo.isDirectoryActive
              ? this.userService.registerAccountDirectory({
                  ...models.accountDirectory,
                  token,
                })
              : this.userService.registerAccountInfo({
                  ...models.accountInfo,
                  token,
                });
            
            return accountCreation$.pipe(
              switchMap((accountResponse) => {
                if (!accountResponse.data) {
                  throw new Error('Error creating account');
                }
                const userId = accountResponse.data;
                
                const updatedModels = this.updateModelsWithIds(
                  models,
                  personId,
                  userId
                );
                
                return forkJoin([
                  this.userService.registerContactInfo(updatedModels.contactInfo),
                  this.userService.registerEmployeeInfo(updatedModels.employeeInfo),
                  this.handleSignatureCreation(signatureInfo, basicInfo, personId).pipe(
                    map(success => ({
                      success: success,
                      message: success ? 'Firma creada exitosamente' : 'Error al crear firma',
                      data: success,
                      status: success ? 200 : 400 // Añadimos el campo status requerido
                    } as ResponseModel<boolean>))
                  )
                ]);
              })
            );
          })
        );
      }),
      catchError(error => {
        console.error('Error creating user:', error);
        this.notificationService.showError('Error al crear usuario');
        return of(null);
      })
    );
  }

  private handleSignatureCreation(
    signatureInfo: SignatureInfoModel,
    basic: any,
    personId: string
  ): Observable<boolean> {
    return from(SecurityUtils.hasPassword(signatureInfo.password)).pipe(
      mergeMap(passwordHash => {
        const imagesToProcess = [
          { type: 'MECHANIC', image: signatureInfo.signatureImageMechanic },
          { type: 'DIGITAL', image: signatureInfo.signatureImageDigital },
          { type: 'RUBRIC', image: signatureInfo.signatureImageRubric }
        ].filter(item => item.image.trim() !== '');
  
        if (imagesToProcess.length === 0) {
          return of(false); // Retorna false si no hay imágenes válidas
        }
  
        const calls = imagesToProcess.map(item => {
          const signatureSecret: SignatureSecretModel = {
            compartmentId: environment.COMPARTMENT_ID,
            vaultId: environment.VAULT_ID,
            keyId: environment.KEY_ID,
            content: {
              value: item.image,
              status: "active",
              passwordHash: passwordHash
            },
            contentName: `${basic.name}_${item.type}`,
            description: `${basic.name} ${basic.lastName} - ${item.type}`,
            secretName: `${basic.document}_${item.type}`,
          };
  
          const signature: SignatureModel = {
            idPerson: personId,
            type: item.type,
            value: item.image
          };
  
          return this.signatureService.createSignatureWithSecret(signatureSecret, signature);
        });
  
        return forkJoin(calls).pipe(
          map(responses => responses.every(r => true)),
          catchError(() => of(false))
        );
      }),
      catchError(() => of(false))
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
    return {
      basicInfo: this.createBasicInfoModel(basicInfo),
      contactInfo: this.createContactInfoModel(contactInfo),
      employeeInfo: this.createEmployeeInfoModel(employeeInfo),
      signatureInfo: this.createSignatureInfoModel(signatureInfo),
      accountInfo: this.createAccountInfoModel(
        basicInfo,
        employeeInfo,
        accountInfo,
        token
      ),
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
    employeeInfo: any,
    accountInfo: any,
    token: string
  ): Omit<AccountModel, 'id'> {
    return {
      avatarPath: accountInfo.avatarPath ?? 'default',
      middleName: basicInfo.middleName,
      firstName: basicInfo.firstName,
      lastName: basicInfo.lastName,
      secondLastName: basicInfo.secondLastName,
      businessEmail: employeeInfo.bussinesEmail,
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
