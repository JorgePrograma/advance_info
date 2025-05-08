// signature-info.component.ts
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { SignatureCardComponent } from "../../../../shared/signature-card/signature-card.component";
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-signature-info',
  templateUrl: './signature-info.component.html',
  styleUrls: ['./signature-info.component.css'],
  imports: [SignatureCardComponent, CommonModule, MatInputModule, ReactiveFormsModule]
})
export class SignatureInfoComponent implements OnInit {
  @Input({ required: true }) formGroupRef!: FormGroup;

  ngOnInit() {
    // Añadimos los controles al formulario si no existen
    if (!this.formGroupRef.get('signatureImageMechanic')) {
      this.formGroupRef.addControl('signatureImageMechanic', new FormControl(null));
    }
    if (!this.formGroupRef.get('signatureImageRubric')) {
      this.formGroupRef.addControl('signatureImageRubric', new FormControl(null));
    }
    if (!this.formGroupRef.get('password')) {
      this.formGroupRef.addControl('password', new FormControl('', [Validators.required]));
    }
  }

  handleFileSelected(file: File, controlName: string): void {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.formGroupRef.get(controlName)?.setValue(e.target.result);
    };
    reader.readAsDataURL(file);
  }

  clearSignature(controlName: string): void {
    this.formGroupRef.get(controlName)?.reset();
  }
}
