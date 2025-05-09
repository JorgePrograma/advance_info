import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  effect,
  inject,
  OnInit,
  signal
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import Swal from 'sweetalert2';
import { GroupService } from '../../../../shared/services/group/group.service';
import { RoleService } from '../../../../shared/services/role/role.service';
import { CombinedUserInfo } from '../../interfaces/combine-user-info';
import { UserServiceList } from '../../services/user/user.service';
import { HasPermissionDirective, PermissionService } from 'permission-info-lib';
import { PermissionConstant } from '../../../../shared/core/permission.constant';

@Component({
  selector: 'app-user-table',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule,
    NgxDatatableModule,
    HasPermissionDirective
  ],
  templateUrl: './user-table.component.html',
  styleUrls: ['./user-table.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserTableComponent implements OnInit {
  isModalOpen = signal(false);
  names: string[] = [];
  permission = PermissionConstant

  private readonly fb = inject(FormBuilder);
  private readonly userService = inject(UserServiceList);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly router = inject(Router);
  // private readonly sharedStatePermission = inject(SharedStateService)
  private readonly permissionService = inject(PermissionService);
  currentPermissions: string[] = [];
  // En el componente
  filtroForm: FormGroup = this.fb.group({
    search: [''],
    estado: [''],
    documento: [''],
    role: [''], // Nuevo control para rol
    group: [''], // Nuevo control para grupo
  });

  columns = [
    {
      name: 'ID',
      prop: 'index',
      width: 30,
      sortable: false,
      cellClass: 'text-center',
      headerClass: 'text-center',
    },
    {
      name: 'Tipo documento',
      prop: 'person.documentType',
      width: 150,
      cellClass: 'text-center',
      headerClass: 'text-center',
    },
    {
      name: 'Documento',
      prop: 'person.documentNumber',
      width: 150,
      cellClass: 'text-center',
      headerClass: 'text-center',
    },
    {
      name: 'Nombre',
      prop: 'person.firstName',
      width: 180,
      cellClass: 'text-center',
      headerClass: 'text-center',
    },
    {
      name: 'Apellido',
      prop: 'person.lastName',
      width: 180,
      cellClass: 'text-center',
      headerClass: 'text-center',
    },
    {
      name: 'Email',
      prop: 'contact.email',
      width: 250,
      cellClass: 'text-center',
      headerClass: 'text-center',
    },
    {
      name: 'Estado',
      prop: 'user.state',
      width: 130,
      cellClass: 'text-center',
      headerClass: 'text-center',
    },
    {
      name: 'Acciones',
      prop: 'actions',
      sortable: false,
      width: 150,
      cellClass: 'flex justify-center items-center',
      headerClass: 'text-center',
    },
  ];

  // Estados disponibles y su configuración
  readonly stateConfig = [
    {
      key: 'active',
      label: 'Activar',
      icon: 'check_circle',
      color: 'primary', // verde
      exclude: ['active'],
    },
    {
      key: 'inactive',
      label: 'Desactivar',
      icon: 'toggle_off',
      color: 'accent', // gris
      exclude: ['inactive'],
    },
    {
      key: 'suspended',
      label: 'Suspender', // yelloww
      icon: 'pause_circle_filled',
      color: 'tertiary',
      exclude: ['suspended'],
    },
    {
      key: 'blocked',
      label: 'Bloquear',
      icon: 'block',
      color: 'warn', // rojo
      exclude: ['blocked'],
    },
  ];
PERMISSIONS: any;

  availableStates(currentState: string) {
    return this.stateConfig.filter(
      (state) => !state.exclude.includes(currentState)
    );
  }

  activeStates(currentState: string) {
    return this.stateConfig.filter((state) =>
      state.exclude.includes(currentState)
    );
  }

  // Obtener icono según estado
  getStatusIcon(
    state: 'active' | 'inactive' | 'suspended' | 'blocked' | 'deleted'
  ): string {
    const icons = {
      active: 'check_circle',
      inactive: 'toggle_off',
      suspended: 'pause_circle',
      blocked: 'block',
      deleted: 'delete_forever',
    };
    return icons[state] || 'help';
  }

  allUsers: CombinedUserInfo[] = [];
  filteredUsers: CombinedUserInfo[] = [];
  pagedRows: CombinedUserInfo[] = [];

  page = {
    offset: 0,
    limit: 10,
  };

  Math = Math;

  constructor() {
    effect(() => {
      const users = this.userService.combinedUsers();
      this.allUsers = users;
      this.page.offset = 0;
      this.applyFilters();
      this.cdr.markForCheck();
    });
  }

  ngOnInit(): void {
   this.loadUsers();
    this.setupFilterListeners();
    this.groupService.getGroups().subscribe();
    this.roleService.getAllRoles().subscribe();
  }

  private loadUsers(): void {
    this.userService.loadAllData();
    this.userService.combinedUsers();
  }

  private setupFilterListeners(): void {
    this.filtroForm.valueChanges.subscribe(() => {
      this.page.offset = 0;
      this.applyFilters();
    });
  }

  private applyFilters(): void {
    const { search, estado, documento, role } = this.filtroForm.value;

    this.filteredUsers = this.allUsers.filter((user) => {
      const searchLower = search?.toLowerCase() ?? '';
      const matchesSearch =
        !search ||
        user.person?.documentNumber?.toLowerCase().includes(searchLower) ||
        user.person?.firstName?.toLowerCase().includes(searchLower) ||
        user.person?.lastName?.toLowerCase().includes(searchLower) ||
        user.user?.userName?.toLowerCase().includes(searchLower);

      const matchesEstado = !estado || user.user?.state === estado;
      const matchesDocumento =
        !documento || user.person?.documentNumber?.includes(documento);

      // Nuevo filtro por rol
      const matchesRole =
        !role || user.user?.roles?.some((r) => r.id === role.id);
      const matchesGroup =
        !role || user.user?.roles?.some((r) => r.id === role.id);

      return (
        matchesSearch &&
        matchesEstado &&
        matchesDocumento &&
        matchesRole &&
        matchesGroup
      );
    });

    this.updatePagedRows();
  }

  updatePagedRows(): void {
    const start = this.page.offset * this.page.limit;
    const end = start + this.page.limit;
    this.pagedRows = this.filteredUsers.slice(start, end);
  }

  onPageChange(newOffset: number): void {
    this.page.offset = newOffset;
    this.updatePagedRows();
  }

getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj) ?? '';
}


  async changeUserStatus(user: any, newState: string): Promise<void> {
    const result = await Swal.fire({
      title: `¿Cambiar estado a ${newState}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
      this.userService
        .updateAccountInfo({ ...user.user, state: newState }, user.user.id)
        .subscribe({
          next: () => {
            Swal.fire('Éxito', 'Estado actualizado', 'success');
            this.userService.loadAllData();
          },
          error: (err) => {
            void Swal.fire('Error', err.message, 'error');
          },
        });
    }
  }

  editUser(user: CombinedUserInfo): void {
    if (user.user?.id) {
      this.router.navigate(['/actualizar', user.user.id]);
    } else {
      Swal.fire('Error', 'No se puede editar este usuario', 'error');
    }
  }

  getTotalPages(): number {
    return Math.ceil(this.filteredUsers.length / this.page.limit);
  }

  getCurrentRange(): string {
    const start = this.page.offset * this.page.limit + 1;
    const end = Math.min(
      (this.page.offset + 1) * this.page.limit,
      this.filteredUsers.length
    );
    return `${start} - ${end}`;
  }

  resetFilters(): void {
    this.filtroForm.reset({
      search: '',
      estado: '',
      documento: '',
      role: '',
      group: '',
    });
    this.applyFilters();
  }
  // Servicios
  private readonly groupService = inject(GroupService);
  private readonly groupSignal = this.groupService.groupSignal;

  private readonly roleService = inject(RoleService);
  private readonly rolesSignal = this.roleService.rolesSignal;

  // Señales para obtener datos
  rolesOptions = computed(() => {
    const roles = this.rolesSignal();

    return roles.map((role) => ({
      value: { id: role.idRole, name: role.nameRole },
      label: role.nameRole,
    }));
  });

  groupOptions = computed(() => {
    const groups = this.groupSignal();
    return groups.map((group) => ({
      value: group.id,
      label: group.description,
    }));
  });

  newUser() {
    this.router.navigate(['/create']);
  }
}
