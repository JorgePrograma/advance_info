import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  Signal,
  computed,
  inject,
  input,
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
/**
 *
 *
 *
 */
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
  private readonly passwordParamaterSignal = passwordParamaterSignal;
  permission = PermissionConstant

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

  /**
   * Inicializa los controles necesarios en el FormGroup.
   */
  private initializeFormControls() {
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
        new FormControl('', [
          Validators.required,
        ])
      );
    }
    if (!this.formGroupRef.contains('confirmationPassword')) {
      this.formGroupRef.addControl(
        'confirmationPassword',
        new FormControl('', Validators.required)
      );
    }
    if (!this.formGroupRef.contains('role')) {
      this.formGroupRef.addControl(
        'role',
        new FormControl('', Validators.required)
      );
    }
  }

  validationPassword(password: string): null | { [key: string]: any } {
    const params = this.passwordParamaterSignal()?.data;
    console.log("password criterio", params)
    if (!params) return { policy: 'No password policy loaded' };

    // Longitud mínima y máxima
    if (password.length < params.minimumLength) return { minLength: true };
    if (password.length > params.maximumLength) return { maxLength: true };

    // Números mínimos
    const numericCount = (password.match(/\d/g) || []).length;
    if (numericCount < params.numericMinimum) return { numericMinimum: true };

    // Minúsculas mínimas
    const lowercaseCount = (password.match(/[a-z]/g) || []).length;
    if (lowercaseCount < params.lowercaseMinimum)
      return { lowercaseMinimum: true };

    // Mayúsculas mínimas
    const uppercaseCount = (password.match(/[A-Z]/g) || []).length;
    if (uppercaseCount < params.uppercaseMinimum)
      return { uppercaseMinimum: true };

    // Caracteres repetidos consecutivos
    if (
      typeof params.repeatedMaximum === 'number' &&
      params.repeatedMaximum >= 0
    ) {
      let currentChar = '';
      let currentCount = 0;
      for (const c of password) {
        if (c === currentChar) {
          currentCount++;
          if (currentCount > params.repeatedMaximum)
            return { repeatedMaximum: true };
        } else {
          currentChar = c;
          currentCount = 1;
        }
      }
    }

    // Si pasa todas las validaciones
    return null;
  }

  passwordPolicyValidator(): ValidatorFn {
    return (control: AbstractControl) => {
      const password = control.value;
      if (!password) return null;
      return this.validationPassword(password);
    };
  }

  /**
   * Maneja el cambio del estado de "Directorio activo".
   * @param isActive Estado actual del checkbox.
   */
  onDirectoryActiveChange() {
    this.isDirectoryActive = !this.isDirectoryActive;

    // Habilitar o deshabilitar los campos según el estado del checkbox
    const userControl = this.formGroupRef.get('user');
    const passwordControl = this.formGroupRef.get('password');
    const confirmationPasswordControl = this.formGroupRef.get(
      'confirmationPassword'
    );

    if (this.isDirectoryActive) {
      userControl?.enable();
      passwordControl?.enable();
      confirmationPasswordControl?.enable();
    } else {
      userControl?.disable();
      passwordControl?.disable();
      confirmationPasswordControl?.disable();
    }
  }
}
