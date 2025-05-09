import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import { FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

// Angular Material
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';

// Componentes y modelos
import { GroupService } from '../../../../shared/services/group/group.service';
import { DynamicFormFieldModel } from '../../model/dynamic-form-field.model';
import { GroupModel } from '../../model/group.model';
import { BranchService } from '../../services/branch/branch.service';
import { DocumentTypeService } from '../../services/document-type/document-type.service';
import { PositionService } from '../../services/position/position.service';
import { DynamicFormFieldComponent } from '../dynamic-form-field/dynamic-form-field.component';
import { forkJoin } from 'rxjs';
import { HasPermissionDirective } from 'permission-info-lib';
import { PermissionConstant } from '../../../../shared/core/permission.constant';

@Component({
  selector: 'app-employee-info',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DynamicFormFieldComponent,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    HasPermissionDirective,
  ],
  templateUrl: './employee-info.component.html',
  styleUrls: ['./employee-info.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeeInfoComponent implements OnInit {
  @Input({ required: true }) formGroupRef!: FormGroup;
  permission = PermissionConstant;

  // Servicios
  private readonly documentTypeService = inject(DocumentTypeService);
  private readonly positionService = inject(PositionService);
  private readonly branchService = inject(BranchService);
  private readonly groupService = inject(GroupService);

  // Señales para obtener datos
  private readonly documentTypesSignal =
    this.documentTypeService.documentTypesSignal;
  private readonly positionSignal = this.positionService.positionSignal;
  private readonly branchSignal = this.branchService.branchSignal;
  private readonly groupSignal = this.groupService.groupSignal;

  // Configuración de la tabla
  displayedColumns: string[] = ['name', 'description', 'actions'];
  selectedGroups: GroupModel[] = [];

  // Señales computadas para opciones
  documentTypeOptions = computed(() => {
    return this.documentTypesSignal().map((type) => ({
      value: type.id,
      label: type.name,
    }));
  });

  branchOptions = computed(() => {
    const branches = this.branchSignal();
    return branches.map((branch) => ({
      value: branch.id,
      label: branch.name as string,
    }));
  });

  positionOptions = computed(() => {
    const position = this.positionSignal();
    return position.map((post) => ({
      value: post.id,
      label: post.name,
    }));
  });

  groupOptions = computed(() => {
    const groups = this.groupSignal();
    return groups.map((group) => ({
      value: group.id,
      label: group.description,
    }));
  });

  // Señal computada para campos del formulario
  basicInfoFields = computed<DynamicFormFieldModel[]>(() => {
    return [
      {
        controlName: 'idBranch',
        label: 'Sucursal',
        type: 'select',
        options: this.branchOptions(),
        validators: [Validators.required],
        appearance: 'outline',
      },
      {
        controlName: 'idPosition',
        label: 'Cargo',
        type: 'select',
        options: this.positionOptions(),
        validators: [Validators.required],
        appearance: 'outline',
      },
      {
        controlName: 'bussinesEmail',
        label: 'Correo Corporativo',
        type: 'text',
        validators: [Validators.required, Validators.pattern(/^\d+$/)],
        placeholder: '123456789',
        appearance: 'outline',
      },
      {
        controlName: 'bussinesPhone',
        label: 'Celular',
        type: 'text',
        validators: [Validators.required],
        placeholder: 'Juan',
        appearance: 'outline',
      },
      {
        controlName: 'idGroup',
        label: 'Agregar Grupo',
        type: 'select',
        options: this.groupOptions(),
        validators: [Validators.required],
        appearance: 'outline',
        onChange: (event: any) => this.addGroup(event.value),
      },
    ];
  });

  ngOnInit() {
    forkJoin([
      this.branchService.getAllBranches(),
      this.groupService.getGroups(),
      this.positionService.getPosition(),
    ]).subscribe();
    // Agrega este código para sincronizar el correo con el username
    const emailControl = this.formGroupRef.get('bussinesEmail');
    if (emailControl) {
      emailControl.valueChanges.subscribe((email) => {
        const userControl = this.formGroupRef.get('user');
        if (userControl) {
          userControl.setValue(email);
        }
      });
    }
  }

  addGroup(groupId: string) {
    const group = this.groupSignal().find((g) => g.id === groupId);
    if (group && !this.selectedGroups.some((g) => g.id === groupId)) {
      this.selectedGroups = [...this.selectedGroups, group];
      this.updateFormGroup();
    }
  }

  removeGroup(groupId: string) {
    this.selectedGroups = this.selectedGroups.filter(
      (group) => group.id !== groupId
    );
    this.updateFormGroup();
  }

  private updateFormGroup() {
    const selectedIds = this.selectedGroups.map((group) => group.id);
    this.formGroupRef.get('idGroup')?.setValue(selectedIds);
  }
}
