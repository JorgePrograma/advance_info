import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatStepperModule } from '@angular/material/stepper';
import { ActivatedRoute } from '@angular/router';
import { catchError, forkJoin, of, switchMap, tap, throwError } from 'rxjs';
import { CombinedUserInfo } from '../../../user-list/interfaces/combine-user-info';
import { UserServiceList } from '../../../user-list/services/user/user.service';
import { AccountDirectoryModel } from '../../model/account-directory.model';
import { AccountModel } from '../../model/account.model';
import { BasicInfoModel } from '../../model/basic-info.model';
import { ContactInfoModel } from '../../model/contact-info.model';
import { EmployeeInfoModel } from '../../model/employee-info.model';
import { ResponseModel } from '../../model/response.model';
import { AuthService } from '../../services/auth/auth.service';
import { NotificationService } from '../../../../shared/services/notification/notification.service';
import { UserService } from '../../services/user/user.service';
import { AccountInfoComponent } from '../account-info/account-info.component';
import { BasicInfoComponent } from '../basic-info/basic-info.component';
import { ContactInfoComponent } from '../contact-info/contact-info.component';
import { EmployeeInfoComponent } from '../employee-info/employee-info.component';
import { SignatureInfoComponent } from "../signature-info/signature-info.component";

@Component({
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
  templateUrl: './user-registration.component.html',
  styleUrls: ['./user-registration.component.css'],
})

export class UserRegistrationComponent {
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
      this.save();
      return !current; // Cambiar estado automáticamente
    });
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
