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
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

// Material extra
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

// Servicio y modelo
import { RoleService } from '../../../../shared/services/role/role.service';
import { AvatarSelectorComponent } from "../../avatar-selector/avatar-selector.component";
import { MatIcon } from '@angular/material/icon';
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
    MatIcon
],
  templateUrl: './account-info.component.html',
  styleUrls: ['./account-info.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountInfoComponent implements OnInit {
  @Input({ required: true }) formGroupRef!: FormGroup;
  private readonly roleService = inject(RoleService);
  private readonly rolesSignal = this.roleService.rolesSignal;
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
        new FormControl('', Validators.required)
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
