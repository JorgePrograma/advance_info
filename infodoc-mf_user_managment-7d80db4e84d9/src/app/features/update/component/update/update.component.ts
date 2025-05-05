import { Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatStepperModule } from '@angular/material/stepper';
import { ActivatedRoute } from '@angular/router';
import { catchError, forkJoin, of, switchMap, tap, throwError } from 'rxjs';
import { CombinedUserInfo } from '../../../user-list/interfaces/combine-user-info';
import { UserServiceList } from '../../../user-list/services/user/user.service';

import { NotificationService } from '../../../../shared/services/notification/notification.service';
import { CommonModule } from '@angular/common';
import { BasicInfoComponent } from '../../../create/component/basic-info/basic-info.component';
import { ContactInfoComponent } from '../../../create/component/contact-info/contact-info.component';
import { EmployeeInfoComponent } from '../../../create/component/employee-info/employee-info.component';
import { AccountInfoComponent } from '../../../create/component/account-info/account-info.component';
import { SignatureInfoComponent } from '../../../create/component/signature-info/signature-info.component';
import { UserService } from '../../../create/services/user/user.service';
import { AuthService } from '../../../create/services/auth/auth.service';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BasicInfoModel } from '../../../create/model/basic-info.model';
import { ContactInfoModel } from '../../../create/model/contact-info.model';
import { EmployeeInfoModel } from '../../../create/model/employee-info.model';
import { AccountModel } from '../../../create/model/account.model';
import { AccountDirectoryModel } from '../../../create/model/account-directory.model';
import { ResponseModel } from '../../../create/model/response.model';

@Component({
  selector: 'app-update',
  imports: [
    MatIconModule,
    MatStepperModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    CommonModule,
    BasicInfoComponent,
    ContactInfoComponent,
    EmployeeInfoComponent,
    AccountInfoComponent,
    SignatureInfoComponent
  ],
  templateUrl: './update.component.html',
  styleUrl: './update.component.css'
})
export class UpdateComponent  implements OnInit {
  registrationForm: FormGroup;
  userUpdate!: CombinedUserInfo | null;
  isEditable = signal<boolean>(true);
  loading = false;
  submitted = false;
  userId: string = '';
  tokenCreateUser: string = '';
  private readonly userService = inject(UserService);
  private readonly authService = inject(AuthService);
  private readonly userListService = inject(UserServiceList);
  private readonly notificationService = inject(NotificationService);
  private readonly route = inject(ActivatedRoute);
  hasSignature = signal<boolean>(false);

  ngOnInit(): void {
    this.isEditable.set(false);
    this.route.params.subscribe((params) => {
      this.userId = params['id'];
      this.getSearchUserByPersonId();
    });
    this.generateTokenUser();
    // Si estamos editando un usuario, verificar si ya tiene firma
    if (this.userUpdate) {
      this.hasSignature.set(true);
      this.addSignatureFormGroup();
    }
  }

private addSignatureFormGroup(): void {
  if (!this.registrationForm.contains('signatureInfo')) {
    this.registrationForm.addControl('signatureInfo', this.fb.group({
      signatureType: ['', Validators.required],
      signatureImage: ['', Validators.required],
    }));
  }
}

// Método para eliminar el FormGroup de firma
private removeSignatureFormGroup(): void {
  if (this.registrationForm.contains('signatureInfo')) {
    this.registrationForm.removeControl('signatureInfo');
  }
}

  private generateRandomDocumentNumber(): string {
    return Math.floor(1000000000 + Math.random() * 9000000000).toString();
  }

  getSearchUserByPersonId(): void {
    if (this.userId) {
      this.loading = true;
      this.userListService.getUserById(this.userId).subscribe({
        next: (completeUser: CombinedUserInfo | null) => {
          if (completeUser) {
            this.loading = true;

            this.userUpdate = completeUser;
            this.patchFormWithUserData(completeUser);
          } else {
            this.notificationService.showError(
              'No se encontró el usuario con el id proporcionado ' + this.userId
            );
          }
        },
        error: (err) => {
          this.loading = false;
          this.notificationService.showError('Error al buscar usuario');
        },
      });
    }
  }

  generateTokenUser(): void {
    this.authService.generateTokenForUser().subscribe({
      next: (response) => {
        this.tokenCreateUser = response.data;
      },
      error: (err) => {
        console.error('Error generando token:', err);
      },
    });
  }

  private patchFormWithUserData(completeUser: CombinedUserInfo): void {
    if (completeUser) {
      this.registrationForm.patchValue({
        basicInfo: {
          documentType: completeUser.person.documentType,
          documentNumber: completeUser.person.documentNumber,
          firstName: completeUser.person.firstName,
          middleName: completeUser.person.middleName,
          lastName: completeUser.person.lastName,
          secondLastName: completeUser.person.secondLastName,
        },
        contactInfo: {
          country: '',
          city: '',
          department: '',
          address: completeUser.contact?.address,
          email: completeUser.contact?.email ?? completeUser.contact?.email,
          phoneNumber: completeUser.contact?.phoneNumber,
        },
      // En el método patchFormWithUserData
signatureInfo: {
  signatureType:  '',
  signatureImage:  ''
},

        employeeInfo: {
          bussinesEmail: completeUser.employee?.bussinesEmail ?? '',
          bussinesPhone: completeUser.employee?.bussinesPhone ?? '',
          idPosition: completeUser.employee?.idPosition ?? '',
          idBranch: completeUser.employee?.idBranch ?? '',
        },
        accountInfo: completeUser.user
          ? {
              avatarPath: completeUser.user.avatarPath,
              role: completeUser.user.roles?.[0].id ?? null, // Assuming single role or null if undefined
              user: completeUser.user.userName, // Assuming 'email' is the correct property
              password: '', // Don't pre-fill password
              confirmationPassword: '',
            }
          : {
              isDirectoryActive: false,
            },
      });
    }
  }

  steps = [
    {
      label: 'Información Personal',
      title: 'Datos Personales',
      subtitle: 'Por favor, completa tu información personal básica',
      formGroupName: 'basicInfo',
      component: 'app-basic-info',
    },
    {
      label: 'Información de Contacto',
      title: 'Datos de Contacto',
      subtitle: 'Proporciona tus medios de contacto principales',
      formGroupName: 'contactInfo',
      component: 'app-contact-info',
    },
    {
      label: 'Información de Empleado',
      title: 'Datos Laborales',
      subtitle: 'Ingresa la información relacionada con tu puesto',
      formGroupName: 'employeeInfo',
      component: 'app-employee-info',
    },
    {
      label: 'Cuenta',
      title: 'Configuración de Cuenta',
      subtitle: 'Establece tus credenciales de acceso',
      formGroupName: 'accountInfo',
      component: 'app-account-info',
    },
  ];

  pos: string = this.generateRandomDocumentNumber();
  constructor(private readonly fb: FormBuilder) {
    this.registrationForm = this.fb.group({
      basicInfo: this.fb.group({
        documentType: ['', Validators.required],
        documentNumber: [
          '',
          [Validators.required, Validators.pattern(/^\d+$/)],
        ],
        firstName: ['', Validators.required],
        middleName: [''],
        lastName: ['', Validators.required],
        secondLastName: [''],
      }),
      contactInfo: this.fb.group({
        country: ['', Validators.required],
        city: ['', Validators.required],
        department: ['', Validators.required],
        address: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        phoneNumber: [
          '',
          [Validators.required, Validators.pattern(/^\d{10}$/)],
        ],
        hasSignature: [false],
      }),
      employeeInfo: this.fb.group({
        bussinesEmail: ['', [Validators.required, Validators.email]],
        bussinesPhone: [
          '',
          [Validators.required, Validators.pattern(/^\d{10}$/)],
        ],
        idPosition: ['', Validators.required],
        idBranch: ['', Validators.required],
        idGroup: ['', Validators.required],
      }),
      accountInfo: this.fb.group(
        {
          avatarPath: ['', Validators.required],
          role: [null, Validators.required],
          user: ['', Validators.required],
          password: [
            '',
            [
              (control: AbstractControl) =>
                this.isEditable() ? Validators.required(control) : null,
              Validators.minLength(8),
              Validators.pattern(
                /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&=])[A-Za-z\d@$!%*#?&=]{8,}$/
              ),
            ],
          ],
          confirmationPassword: [
            '',
            this.isEditable() ? Validators.required : null,
          ],
        },
        { validator: this.isEditable() ? this.passwordMatchValidator : null }
      ),
    });
  }

  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const confirmation = formGroup.get('confirmationPassword')?.value;
    return password === confirmation ? null : { passwordMismatch: true };
  }

  getFormGroup(name: string): FormGroup {
    return this.registrationForm.get(name) as FormGroup;
  }

  onSubmit(): void {
    this.isEditable.update((current) => {
      if (current) {
        this.save();
      } else {
        this.edit();
      }
      return !current; // Cambiar estado automáticamente
    });
  }

  private edit(): void {
    this.notificationService.showLoading('Actualizando usuario...');
    const { basicInfo, contactInfo, employeeInfo, accountInfo } =
      this.registrationForm.value;

    // 1. Preparar modelos de datos con IDs existentes
    const basicInfoModel: BasicInfoModel = {
      id: this.userUpdate?.person.id ?? '', // ID existente
      documentType: basicInfo.documentType,
      documentNumber: basicInfo.documentNumber,
      firstName: basicInfo.firstName,
      middleName: basicInfo.middleName ?? undefined,
      lastName: basicInfo.lastName,
      secondLastName: basicInfo.secondLastName ?? undefined,
    };

    const contactInfoModel: ContactInfoModel = {
      id: this.userUpdate?.contact?.id ?? '', // ID existente
      idPerson: basicInfo.id, // Ya tenemos el ID de la persona
      email: contactInfo.email,
      phoneNumber: contactInfo.phoneNumber,
      address: contactInfo.address,
    };

    const employeeInfoModel: EmployeeInfoModel = {
      id: this.userUpdate?.employee?.id ?? '', // ID existente
      idPerson: basicInfo.id, // Ya tenemos el ID de la persona
      bussinesEmail: employeeInfo.bussinesEmail,
      bussinesPhone: employeeInfo.bussinesPhone,
      idBranch: employeeInfo.idBranch,
      idPosition: employeeInfo.idPosition,
      idUser: accountInfo.isDirectoryActive ? accountInfo.id : undefined,
    };

    const accountInfoModel: AccountModel = {
      id: this.userUpdate?.user?.id ?? '',
      avatarPath: accountInfo.avatarPath ?? 'sash',
      middleName: basicInfo.middleName,
      firstName: basicInfo.firstName,
      lastName: basicInfo.lastName,
      secondLastName: basicInfo.secondLastName,
      businessEmail: employeeInfo.bussinesEmail,
      password: accountInfo.password,
      roles: [accountInfo.role],
      token: this.tokenCreateUser,
    };

    // 2. Actualizar usando forkJoin para realizar todas las actualizaciones en paralelo
    forkJoin({
      basicInfo: this.userService.updateBasicInfo(basicInfoModel, ''),
      contactInfo: this.userService.updateContactInfo(contactInfoModel, ''),
      employeeInfo: this.userService.updateEmployeeInfo(employeeInfoModel, ''),
      accountInfo: accountInfo.isDirectoryActive
        ? this.userService.updateAccountInfo(accountInfoModel, '')
        : of(null),
    })
      .pipe(
        tap({
          next: (responses) => {
            if (accountInfo.isDirectoryActive) {
              if (
                responses.basicInfo &&
                responses.contactInfo &&
                responses.employeeInfo &&
                responses.accountInfo
              ) {
                this.notificationService.showSuccess(
                  'Usuario actualizado exitosamente'
                );
              } else {
                this.notificationService.showError(
                  'Hubo un problema al actualizar el usuario'
                );
              }
            } else {
              if (
                responses.basicInfo &&
                responses.contactInfo &&
                responses.employeeInfo
              ) {
                this.notificationService.showSuccess(
                  'Usuario actualizado exitosamente'
                );
              } else {
                this.notificationService.showError(
                  'Hubo un problema al actualizar la información del usuario'
                );
              }
            }
          },
          error: (error) => {
            this.notificationService.showError(
              'Error al actualizar: ' +
                (error.erros ? error.erros[0] : error.message)
            );
            console.error('Error de actualización:', error);
          },
        }),
        catchError((error) => {
          console.error('Error general:', error);
          return of(null);
        })
      )
      .subscribe();
  }

  private save(): void {
    this.notificationService.showLoading('Creando usuario...');

    const { basicInfo, contactInfo, employeeInfo, accountInfo } =
      this.registrationForm.value;

    // 1. Modelos de datos
    const basicInfoModel: Omit<BasicInfoModel, 'id'> = {
      documentType: basicInfo.documentType,
      documentNumber: basicInfo.documentNumber,
      firstName: basicInfo.firstName,
      middleName: basicInfo.middleName ?? undefined,
      lastName: basicInfo.lastName,
      secondLastName: basicInfo.secondLastName ?? undefined,
    };

    const contactInfoModel: Omit<ContactInfoModel, 'id'> = {
      idPerson: '',
      email: contactInfo.email,
      phoneNumber: contactInfo.phoneNumber,
      address: contactInfo.address,
    };

    const employeeInfoModel: Omit<EmployeeInfoModel, 'id'> = {
      bussinesEmail: employeeInfo.bussinesEmail,
      bussinesPhone: employeeInfo.bussinesPhone,
      idPerson: '',
      idUser: '',
    };

    const accountInfoModel: Omit<AccountModel, 'id'> = {
      avatarPath: accountInfo.avatarPath ?? 'default',
      middleName: basicInfo.middleName,
      firstName: basicInfo.firstName,
      lastName: basicInfo.lastName,
      secondLastName: basicInfo.secondLastName,
      businessEmail: employeeInfo.bussinesEmail,
      password: accountInfo.password,
      roles: [accountInfo.role],
      token: this.tokenCreateUser,
    };

    const accountHasDirectory: AccountDirectoryModel = {
      avatarPath: accountInfo.avatarPath ?? 'default',
      userName: employeeInfo.bussinesEmail,
      roles: [accountInfo.role],
      token: this.tokenCreateUser,
    };

    this.userService
      .getUserByDocument(basicInfoModel.documentNumber)
      .pipe(
        switchMap((user) => {
          if (user) {
            this.notificationService.showError(
              'Ya existe un usuario con ese documento'
            );
            return throwError(() => 'Usuario ya existe');
          }

          // Primero verificamos si tiene directorio activo
          if (accountInfo.isDirectoryActive) {
            return this.userService
              .registerAccountDirectory(accountHasDirectory)
              .pipe(
                switchMap((accountResponse: ResponseModel<string>) => {
                  if (!accountResponse.data) {
                    throw new Error(
                      'No se pudo completar el registro debido a un problema técnico. Por favor, inténtelo más tarde o contacte con soporte técnico.'
                    );
                  }
                  employeeInfoModel.idUser = accountResponse.data;
                  return this.userService.registerBasicInfo(basicInfoModel);
                })
              );
          } else {
            return this.userService.registerBasicInfo(basicInfoModel);
          }
        }),
        switchMap((basicInfoResponse: ResponseModel<string>) => {
          const idPerson = basicInfoResponse.data;
          contactInfoModel.idPerson = idPerson;
          employeeInfoModel.idPerson = idPerson;

          // Si NO tiene directorio activo, registramos la cuenta primero
          if (!accountInfo.isDirectoryActive) {
            return this.userService.registerAccountInfo(accountInfoModel).pipe(
              switchMap((accountResponse: ResponseModel<string>) => {
                if (!accountResponse.data) {
                  throw new Error(
                    'No se pudo completar el registro debido a un problema técnico. Por favor, inténtelo más tarde o contacte con soporte técnico.'
                  );
                }
                employeeInfoModel.idUser = accountResponse.data;
                return forkJoin([
                  this.userService.registerEmployeeInfo(employeeInfoModel),
                  this.userService.registerContactInfo(contactInfoModel),
                ]);
              })
            );
          } else {
            // Si tiene directorio activo, ya tenemos el idUser, solo registramos empleado y contacto
            return forkJoin([
              this.userService.registerEmployeeInfo(employeeInfoModel),
              this.userService.registerContactInfo(contactInfoModel),
            ]);
          }
        }),
        tap({
          next: ([employeeResponse, contactResponse]) => {
            this.notificationService.showSuccess(
              'Usuario registrado con exito'
            );
            this.registrationForm.reset();
          },
          error: (error) => {
            if (error !== 'Usuario ya existe') {
              this.notificationService.showError(
                'No se pudo completar el registro debido a un problema técnico. Por favor, inténtelo más tarde o contacte con soporte técnico.'
              );
              console.error('Error completo:', error);
            }
          },
        }),
        catchError((error) => {
          // Limpieza adicional si es necesaria
          return of(null);
        })
      )
      .subscribe();
  }



// Asegúrate de tener este método para manejar el cambio del toggle
// Reemplaza el método handleSignatureChange
handleSignatureChange(hasSignature: boolean): void {
  this.hasSignature.set(hasSignature);
  
  if (hasSignature) {
    if (!this.registrationForm.contains('signatureInfo')) {
      this.registrationForm.addControl('signatureInfo', this.fb.group({
        signatureType: ['', Validators.required],
        signatureImage: ['', Validators.required]
      }));
    }
  } else {
    if (this.registrationForm.contains('signatureInfo')) {
      this.registrationForm.removeControl('signatureInfo');
    }
  }
  
  // Esto forzará la actualización de los steps
  this.steps = [...this.dynamicSteps];
}

// Reemplaza la propiedad steps por esta propiedad computada
get dynamicSteps() {
  const baseSteps = [
    {
      label: 'Información Personal',
      title: 'Datos Personales',
      subtitle: 'Por favor, completa tu información personal básica',
      formGroupName: 'basicInfo',
      component: 'app-basic-info',
    },
    {
      label: 'Información de Contacto',
      title: 'Datos de Contacto',
      subtitle: 'Proporciona tus medios de contacto principales',
      formGroupName: 'contactInfo',
      component: 'app-contact-info',
    }
  ];

  // Solo incluir el paso de firma si hasSignature es true
  if (this.hasSignature()) {
    baseSteps.push({
      label: 'Firma Digital',
      title: 'Configuración de Firma',
      subtitle: 'Configura los detalles de la firma digital',
      formGroupName: 'signatureInfo',
      component: 'app-signature-info',
    });
  }

  // Agregar los demás pasos
  return baseSteps.concat([
    {
      label: 'Información de Empleado',
      title: 'Datos Laborales',
      subtitle: 'Ingresa la información relacionada con tu puesto',
      formGroupName: 'employeeInfo',
      component: 'app-employee-info',
    },
    {
      label: 'Cuenta',
      title: 'Configuración de Cuenta',
      subtitle: 'Establece tus credenciales de acceso',
      formGroupName: 'accountInfo',
      component: 'app-account-info',
    }
  ]);
}
}
