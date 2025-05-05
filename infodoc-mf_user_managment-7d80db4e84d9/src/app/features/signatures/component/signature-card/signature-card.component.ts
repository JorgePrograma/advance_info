import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDivider } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-signature-card',
  imports: [CommonModule, MatCardModule, MatIconModule, MatDivider],
  templateUrl: './signature-card.component.html',
  styleUrl: './signature-card.component.css'
})

export class SignatureCardComponent {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  @Input() title = '';
  @Input() icon = '';
  @Input() preview = '';
  @Input() fileName = '';
  @Input() uploadText = 'Subir Certificado';
  @Input() allowedFormats = 'Formatos: .p12, .pfx';
  @Input() fileAccept = '.p12,.pfx';
  @Input() saveLabel = 'Certificado';

  @Output() fileSelected = new EventEmitter<File>();
  @Output() onSave = new EventEmitter<void>();
  @Output() onClear = new EventEmitter<void>();

  openFileSelector(): void {
    this.fileInput.nativeElement.click();
  }

  handleFileInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.fileSelected.emit(input.files[0]);
    }
  }
}
