// signature-info.component.ts
import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DynamicFormFieldComponent } from '../dynamic-form-field/dynamic-form-field.component';
import { DynamicFormFieldModel } from '../../model/dynamic-form-field.model';

@Component({
  selector: 'app-signature-info',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DynamicFormFieldComponent
  ],
  templateUrl: './signature-info.component.html',
  styleUrls: ['./signature-info.component.css']
})
export class SignatureInfoComponent {
  @Input() formGroupRef!: FormGroup;
  
  signatureFields: DynamicFormFieldModel[] = [
    {
      controlName: 'signatureType',
      label: 'Tipo de Firma',
      type: 'select',
      options: [
        { value: 'digital', label: 'Firma Digital' },
        { value: 'electronica', label: 'Firma Electrónica' }
      ],
      validators: [Validators.required],
      appearance: 'outline'
    },
    {
      controlName: 'signatureImage',
      label: 'Imagen de Firma',
      type: 'tel',
      appearance: 'outline'
    }
  ];
}
