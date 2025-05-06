import { PasswordParamaterService } from './../../services/password-paramater/password-paramater.service';
import { passwordParamaterSignal } from './../../model/password-paramater.model';
import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  Inject,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatStepperModule } from '@angular/material/stepper';
import { ActivatedRoute } from '@angular/router';
import { catchError, of, tap } from 'rxjs';
import { NotificationService } from '../../../../shared/services/notification/notification.service';
import { CombinedUserInfo } from '../../../user-list/interfaces/combine-user-info';
import { UserServiceList } from '../../../user-list/services/user/user.service';
import { AuthService } from '../../services/auth/auth.service';
import { ProcessTransactionCreateService } from '../../services/process-transaction-create/process-transaction-create.service';
import { StepConfigurationService } from '../../services/step-configuration/step-configuration.service';
import { UserFormFactoryService } from '../../services/user-form-factory/user-form.factory.service';
import { AccountInfoComponent } from '../account-info/account-info.component';
import { BasicInfoComponent } from '../basic-info/basic-info.component';
import { ContactInfoComponent } from '../contact-info/contact-info.component';
import { EmployeeInfoComponent } from '../employee-info/employee-info.component';
import { SignatureInfoComponent } from '../signature-info/signature-info.component';

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
    SignatureInfoComponent,
  ],
  templateUrl: './user-registration.component.html',
  styleUrls: ['./user-registration.component.css'],
})
export class UserRegistrationComponent implements OnInit {
  registrationForm: FormGroup;
  userUpdate!: CombinedUserInfo | null;
  isEditable = signal<boolean>(false);
  loading = false;
  submitted = false;
  userId: string = '';
  tokenCreateUser: string = '';
  private readonly authService = inject(AuthService);
  private readonly userListService = inject(UserServiceList);
  private readonly notificationService = inject(NotificationService);
  private readonly route = inject(ActivatedRoute);
  private readonly userFormFactory = inject(UserFormFactoryService);
  private readonly passwordParamaterService = inject(PasswordParamaterService);
  hasSignature = signal<boolean>(false);
  private readonly transactionService = inject(ProcessTransactionCreateService);

  private readonly stepConfigurationService = inject(StepConfigurationService);
  steps = computed(() =>
    this.stepConfigurationService.getSteps(this.hasSignature())
  );

  ngOnInit(): void {
    this.passwordParamaterService.loadAllData().subscribe();
    this.route.params.subscribe((params) => {
      this.userId = params['id'];
      this.isEditable.set(!this.userId);
      this.getSearchUserByPersonId();
    });
    this.generateTokenUser();
    if (this.userUpdate) {
      this.hasSignature.set(true);
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
        console.log("generate token", response.data)
        this.tokenCreateUser = response.data;
      },
      error: (err) => {
        console.error('Error generando token:', err);
      },
    });
  }

  constructor(private readonly fb: FormBuilder) {
    this.registrationForm = this.userFormFactory.createRegistrationForm();
  }

  getFormGroup(name: string): FormGroup {
    return this.registrationForm.get(name) as FormGroup;
  }

  onSubmit(): void {
    this.save();
  }

  private save(): void {
    this.notificationService.showLoading('Creando usuario...');
    console.log(
      'Formulario enviado:',
      JSON.stringify(this.registrationForm.value)
    );
    this.transactionService
      .createUser(this.registrationForm.value, this.tokenCreateUser)
      .pipe(
        tap({
          next: () => {
            this.notificationService.showSuccess(
              'Usuario registrado con éxito'
            );
            this.registrationForm.reset();
          },
          error: (error) => {
            if (error !== 'Usuario ya existe') {
              this.notificationService.showError(
                'Lo sentimos, no se pudo crear el usuario'
              );
            }
          },
        }),
        catchError((error) => {
          console.error('Error completo:', error);
          return of(null);
        })
      )
      .subscribe();
  }

  handleSignatureChange(hasSignature: boolean): void {
    this.hasSignature.set(hasSignature);
    if (hasSignature) {
      if (!this.registrationForm.contains('signatureInfo')) {
        this.registrationForm.addControl(
          'signatureInfo',
          this.fb.group({
            signatureImageMechanic: 'signatureImageMechanic',
            signatureImageDigital: 'signatureImageDigital',
            signatureImageRubric: 'signatureImageRubric',
            password: 'password',
          })
        );
      }
    } else {
      if (this.registrationForm.contains('signatureInfo')) {
        this.registrationForm.removeControl('signatureInfo');
      }
    }
  }

}
