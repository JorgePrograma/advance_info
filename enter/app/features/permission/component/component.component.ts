import { Component, OnInit, inject, effect, computed } from '@angular/core';
import { ApplicationService } from '../services/application/application.service';
import { HasPermissionDirective, PermissionService } from '@developeradaza/permissions-lib';
import { RoleService } from '../../../shared/services/role/role.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { PermissionConstant } from '../../../shared/core/permission.constant';

@Component({
  selector: 'app-component',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    HasPermissionDirective,
  ],
  templateUrl: './component.component.html',
  styleUrls: ['./component.component.css']
})
export class ComponentComponent implements OnInit {
[x: string]: any;
  // Servicios
  private readonly serviceApplication = inject(ApplicationService);
  private readonly roleService = inject(RoleService);
  permission = PermissionConstant;
  // Señales y controles
  applications = this.serviceApplication.actions;
  roleControl = new FormControl();

  rolesOptions = computed(() => {
    return this.roleService.rolesSignal().map(role => ({
      value: { id: role.idRole, name: role.nameRole },
      label: role.nameRole
    }));
  });

  ngOnInit(): void {
    this.serviceApplication.loadAllData();
    this.roleService.getAllRoles().subscribe();
  }

  // Método para manejar la selección de rol
  onRoleSelected(selectedRole: any) {
  }
}


