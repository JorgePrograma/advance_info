// signature-card.component.ts
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-signature-card',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule
  ],
  templateUrl: './signature-card.component.html',
  styleUrls: ['./signature-card.component.css']
})
export class SignatureCardComponent {
  @Input() title: string = 'Firma';
  @Input() icon: string = 'edit';
  @Input() formGroupRef!: FormGroup;
  @Input() controlName: string = '';
  @Input() showPasswordField: boolean = false;

  @Output() fileSelected = new EventEmitter<File>();
  @Output() clear = new EventEmitter<void>();

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.fileSelected.emit(input.files[0]);
    }
  }

  onClear(): void {
    this.clear.emit();
  }
}
