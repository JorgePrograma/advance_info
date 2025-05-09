import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  computed,
  inject,
} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';

// Material extra
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

// Servicio y modelo
import { RoleService } from '../../../../shared/services/role/role.service';
import { AvatarSelectorComponent } from '../../avatar-selector/avatar-selector.component';
import { MatIcon } from '@angular/material/icon';
import { passwordParamaterSignal } from '../../model/password-paramater.model';
import { PermissionConstant } from '../../../../shared/core/permission.constant';
import { HasPermissionDirective } from 'permission-info-lib';
import { PasswordValidators } from '../../../../shared/core/utils/password.validators';

@Component({
  selector: 'app-account-info',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    AvatarSelectorComponent,
    MatIcon,
    HasPermissionDirective
  ],
  templateUrl: './account-info.component.html',
  styleUrls: ['./account-info.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountInfoComponent implements OnInit {
  @Input({ required: true }) formGroupRef!: FormGroup;
  private readonly roleService = inject(RoleService);
  private readonly rolesSignal = this.roleService.rolesSignal;
  permission = PermissionConstant;

  showPassword = false;
  showConfirmPassword = false;
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  isDirectoryActive = false;

  rolesOptions = computed(() => {
    const roles = this.rolesSignal();
    return roles.map((role) => ({
      value: { id: role.idRole, name: role.nameRole },
      label: role.nameRole,
    }));
  });

  ngOnInit() {
    this.roleService.getAllRoles().subscribe();
    this.initializeFormControls();
    if (!this.isDirectoryActive) {
      const emailControl = this.formGroupRef.get('bussinesEmail');
      const userControl = this.formGroupRef.get('user');
      if (emailControl && userControl) {
        userControl.setValue(emailControl.value);
      }
    }
  }

  private initializeFormControls() {
    const criteria = passwordParamaterSignal()?.data;

    if (!this.formGroupRef.contains('isDirectoryActive')) {
      this.formGroupRef.addControl('isDirectoryActive', new FormControl(false));
    }
    if (!this.formGroupRef.contains('user')) {
      this.formGroupRef.addControl(
        'user',
        new FormControl('', Validators.required)
      );
    }

    if (!this.formGroupRef.contains('password')) {
      this.formGroupRef.addControl(
        'password',
        new FormControl(
          '',
          ...PasswordValidators.createPasswordValidators(criteria!),
        )
      );
    }
    if (!this.formGroupRef.contains('confirmationPassword')) {
      this.formGroupRef.addControl(
        'confirmationPassword',
        new FormControl('', [
          Validators.required,
          PasswordValidators.confirmPasswordValidator()
        ])
      );
    }
    if (!this.formGroupRef.contains('role')) {
      this.formGroupRef.addControl(
        'role',
        new FormControl('', Validators.required)
      );
    }
  }


  /**
   * Validador para confirmar que las contraseñas coincidan
   */
  confirmPasswordValidator(): ValidatorFn {
    return (control: AbstractControl) => {
      if (!this.formGroupRef) return null;

      const password = this.formGroupRef.get('password')?.value;
      const confirmPassword = control.value;

      if (!password || !confirmPassword) return null;

      return password === confirmPassword ? null : { passwordMismatch: true };
    };
  }

  /**
   * Maneja el cambio del estado de "Directorio activo".
   */
  onDirectoryActiveChange() {
    this.isDirectoryActive = !this.isDirectoryActive;

    const userControl = this.formGroupRef.get('user');
    const passwordControl = this.formGroupRef.get('password');
    const confirmationPasswordControl = this.formGroupRef.get('confirmationPassword');

    if (this.isDirectoryActive) {
      userControl?.enable();
      passwordControl?.enable();
      confirmationPasswordControl?.enable();
    } else {
      userControl?.disable();
      passwordControl?.disable();
      confirmationPasswordControl?.disable();

      // Resetear valores cuando se desactiva
      userControl?.reset('');
      passwordControl?.reset('');
      confirmationPasswordControl?.reset('');

      // Copiar el email al usuario si está disponible
      const emailControl = this.formGroupRef.get('bussinesEmail');
      if (emailControl) {
        userControl?.setValue(emailControl.value);
      }
    }
  }

}
