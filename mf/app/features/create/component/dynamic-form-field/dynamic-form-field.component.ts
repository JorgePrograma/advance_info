import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { DynamicFormFieldModel } from '../../model/dynamic-form-field.model';

@Component({
  selector: 'app-dynamic-form-field',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  template: `
    <div
      [formGroup]="formGroupRef"
      [ngSwitch]="config.type"
      class="dynamic-field"
    >
      <mat-form-field [appearance]="config.appearance || 'outline'">
        <mat-label>{{ config.label }}</mat-label>

        <!-- Input de Texto/Número/Email/Password -->
        <input
          *ngSwitchCase="'text'"
          matInput
          [formControlName]="config.controlName"
          [placeholder]="config.placeholder || ''"
        />

        <input
          *ngSwitchCase="'number'"
          matInput
          type="number"
          [formControlName]="config.controlName"
          [placeholder]="config.placeholder || ''"
        />

        <input
          *ngSwitchCase="'email'"
          matInput
          type="email"
          [formControlName]="config.controlName"
          [placeholder]="config.placeholder || ''"
        />

        <input
          *ngSwitchCase="'password'"
          matInput
          type="password"
          [formControlName]="config.controlName"
          [placeholder]="config.placeholder || ''"
        />

        <!-- Select -->
        <mat-select
          *ngSwitchCase="'select'"
          [formControlName]="config.controlName"
          [compareWith]="compareWith"
          (selectionChange)="config.onChange?.($event)"
        >
          <mat-option value="">Seleccione</mat-option>
          <mat-option
            *ngFor="let option of currentOptions"
            [value]="option.value"
          >
            {{ option.label }}
          </mat-option>
        </mat-select>

        <!-- Errores -->
        <mat-error
          *ngIf="
            formGroupRef.get(config.controlName)?.invalid &&
            formGroupRef.get(config.controlName)?.touched
          "
        >
          {{ getErrorMessage() }}
        </mat-error>
      </mat-form-field>
    </div>
  `,
  styles: [
    `
      .dynamic-field {
        margin-bottom: 5px;
      }
      mat-form-field {
        width: 100%;
      }
    `,
  ],
})
export class DynamicFormFieldComponent implements OnChanges {
  @Input({ required: true }) formGroupRef!: FormGroup;
  @Input({ required: true }) config!: DynamicFormFieldModel;
  currentOptions: any[] = [];

  ngOnChanges(changes: SimpleChanges) {
    if (changes['config'] && this.config) {
      this.currentOptions = [...(this.config.options || [])];
    }
  }

  compareWith(a: any, b: any): boolean {
    return a === b; // Comparación directa sin conversión a string
  }

  // Mejor manejo de mensajes de error
  getErrorMessage(): string {
    const control = this.formGroupRef.get(this.config.controlName);
    if (!control?.errors) return '';

    if (control.errors['required']) {
      return `${this.config.label} es requerido`;
    }
    if (control.errors['pattern']) {
      return `${this.config.label} tiene formato inválido`;
    }
    return `${this.config.label} es inválido`;
  }
}
