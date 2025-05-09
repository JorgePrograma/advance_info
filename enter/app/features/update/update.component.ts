import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatStepperModule } from '@angular/material/stepper';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, of, switchMap, tap } from 'rxjs';
import { BasicInfoComponent } from '../create/component/basic-info/basic-info.component';
import { ContactInfoComponent } from '../create/component/contact-info/contact-info.component';
import { EmployeeInfoComponent } from '../create/component/employee-info/employee-info.component';
import { AccountInfoComponent } from '../create/component/account-info/account-info.component';
import { SignatureInfoComponent } from '../create/component/signature-info/signature-info.component';
import { CombinedUserInfo } from '../user-list/interfaces/combine-user-info';
import { AuthService } from '../create/services/auth/auth.service';
import { UserServiceList } from '../user-list/services/user/user.service';
import { NotificationService } from '../../shared/services/notification/notification.service';
import { UserFormFactoryService } from '../create/services/user-form-factory/user-form.factory.service';
import { PasswordParamaterService } from '../create/services/password-paramater/password-paramater.service';
import { StepConfigurationService } from '../create/services/step-configuration/step-configuration.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-update',
  standalone: true,
  imports: [
    MatIconModule,
    MatStepperModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    CommonModule,
    ReactiveFormsModule,
    BasicInfoComponent,
    ContactInfoComponent,
    EmployeeInfoComponent,
    AccountInfoComponent,
    SignatureInfoComponent,
  ],
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.css']
})
export class UpdateComponent implements OnInit {
  registrationForm!: FormGroup;
  userUpdate: CombinedUserInfo | null = null;
  isEditable = signal<boolean>(false);
  loading = signal<boolean>(false);
  submitted = false;
  userId: string = '';
  tokenUpdateUser: string = '';

  private readonly authService = inject(AuthService);
  private readonly userListService = inject(UserServiceList);
  private readonly notificationService = inject(NotificationService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly userFormFactory = inject(UserFormFactoryService);
  private readonly passwordParamaterService = inject(PasswordParamaterService);
  private readonly stepConfigurationService = inject(StepConfigurationService);

  hasSignature = signal<boolean>(false);
  steps = computed(() => this.stepConfigurationService.getSteps(this.hasSignature()));

  constructor(private readonly fb: FormBuilder) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.passwordParamaterService.loadAllData().subscribe();
    this.route.params.pipe(
      tap(params => {
        this.userId = params['id'];
        this.isEditable.set(!!this.userId);
        if (this.userId) {
          this.loadUserData();
        }
      })
    ).subscribe();

    this.generateTokenUser();
  }

  initializeForm(): void {
    this.registrationForm = this.userFormFactory.createRegistrationForm();
  }

  loadUserData(): void {
    this.loading.set(true);
    this.userListService.getUserById(this.userId).pipe(
      tap({
        next: (userData) => {
          if (userData) {
            this.userUpdate = userData;
            this.patchFormWithUserData(userData);
            this.hasSignature.set(!!userData.signature);
          } else {
            this.notificationService.showError('Usuario no encontrado');
            this.router.navigate(['/users']);
          }
          this.loading.set(false);
        },
        error: () => {
          this.notificationService.showError('Error al cargar usuario');
          this.loading.set(false);
        }
      })
    ).subscribe();
  }

  patchFormWithUserData(userData: CombinedUserInfo): void {
    this.registrationForm.patchValue({
      basicInfo: {
        documentType: userData.person.documentType,
        documentNumber: userData.person.documentNumber,
        firstName: userData.person.firstName,
        middleName: userData.person.middleName,
        lastName: userData.person.lastName,
        secondLastName: userData.person.secondLastName
      },
      contactInfo: {
        email: userData.contact?.email,
        phone: userData.contact?.phone,
        address: userData.contact?.address
      },
      employeeInfo: {
        bussinesEmail: userData.employee?.bussinesEmail,
        bussinesPhone: userData.employee?.bussinesPhone,
        idPosition: userData.employee?.idPosition,
        idBranch: userData.employee?.idBranch
      },
      accountInfo: {
        avatarPath: userData.user?.avatarPath,
        user: userData.user?.userName,
        role: userData.user?.roles?.[0],
        isDirectoryActive: !!userData.user?.idUserIDCS
      }
    });

    if (userData.signature) {
      this.registrationForm.addControl('signatureInfo',
        this.userFormFactory.createSignatureInfoForm());
      this.registrationForm.get('signatureInfo')?.patchValue({
      });
    }
  }

  generateTokenUser(): void {
    this.authService.generateTokenForUser().pipe(
      tap({
        next: (response) => this.tokenUpdateUser = response.data,
        error: () => this.notificationService.showError('Error al generar token')
      })
    ).subscribe();
  }

  getFormGroup(name: string): FormGroup {
    return this.registrationForm.get(name) as FormGroup;
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.registrationForm.invalid) {
      this.notificationService.showError('Por favor complete todos los campos requeridos');
      return;
    }

    this.loading.set(true);
    this.notificationService.showLoading('Procesando usuario...');

    const formData = this.registrationForm.value;

    if (this.userId) {
      this.updateExistingUser(formData);
    } else {
      this.createNewUser(formData);
    }
  }

  updateExistingUser(formData: any): void {
 /*   this.updateService.updateUser(this.userId, formData, this.tokenUpdateUser).pipe(
      tap({
        next: () => {
          this.notificationService.showSuccess('Usuario actualizado con éxito');
          this.router.navigate(['/users']);
        },
        error: (error) => {
          this.notificationService.showError(error.message || 'Error al actualizar usuario');
          this.loading.set(false);
        }
      }),
      catchError(() => {
        this.loading.set(false);
        return of(null);
      })
    ).subscribe();*/
  }

  createNewUser(formData: any): void {
  /*  this.updateService.createUser(formData, this.tokenUpdateUser).pipe(
      tap({
        next: () => {
          this.notificationService.showSuccess('Usuario creado con éxito');
          this.registrationForm.reset();
          this.router.navigate(['/users']);
        },
        error: (error) => {
          this.notificationService.showError(error.message || 'Error al crear usuario');
          this.loading.set(false);
        }
      }),
      catchError(() => {
        this.loading.set(false);
        return of(null);
      })
    ).subscribe();*/
  }

  handleSignatureChange(hasSignature: boolean): void {
    this.hasSignature.set(hasSignature);

    if (hasSignature && !this.registrationForm.contains('signatureInfo')) {
      this.registrationForm.addControl(
        'signatureInfo',
        this.userFormFactory.createSignatureInfoForm()
      );
    } else if (!hasSignature && this.registrationForm.contains('signatureInfo')) {
      this.registrationForm.removeControl('signatureInfo');
    }
  }
}
