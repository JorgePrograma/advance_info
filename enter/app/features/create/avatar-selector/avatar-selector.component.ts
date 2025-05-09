import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-avatar-selector',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    ReactiveFormsModule
  ],
  templateUrl: './avatar-selector.component.html',
  styleUrls: ['./avatar-selector.component.css']
})
export class AvatarSelectorComponent {
  @Input({ required: true }) formGroupRef!: FormGroup;
  @Input() maxFileSize: number = 5; // MB
  @Output() fileSelected = new EventEmitter<File>(); // Nuevo Output para notificar al padre

  previewUrl: string | ArrayBuffer | null = null;
  isDragging = false;
  file: File | null = null;
  isLoading = false;

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = (e: any) => this.onFileSelected(e);
      input.click();
    }
  }

  onFileSelected(event: any): void {
    this.isDragging = false;
    const input = event.target as HTMLInputElement;
    if (input.files?.[0]) {
      this.processFile(input.files[0]);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;

    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      this.processFile(event.dataTransfer.files[0]);
    }
  }

  private validateFileType(file: File): boolean {
    const imageRegex = /image\/(jpeg|png|gif|webp)/;
    if (!imageRegex.exec(file.type)) {
      this.formGroupRef.get('avatarFile')?.setErrors({ invalidImage: true });
      return false;
    }
    return true;
  }

  private validateFileSize(file: File): boolean {
    if (file.size > this.maxFileSize * 1024 * 1024) {
      this.formGroupRef.get('avatarFile')?.setErrors({ fileSize: true });
      return false;
    }
    return true;
  }

  private processFile(file: File): void {
    this.isLoading = true;

    if (!this.validateFileType(file) || !this.validateFileSize(file)) {
      this.isLoading = false;
      return;
    }

    this.file = file;
    this.fileSelected.emit(file); // Notificar al componente padre
    this.formGroupRef.get('avatarPath')?.setValue(file); // Guardar el File en el formulario
    this.formGroupRef.get('avatarPath')?.setErrors(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      this.previewUrl = e.target?.result as string;
      this.isLoading = false;
    };
    reader.onerror = () => {
      this.formGroupRef.get('avatarPath')?.setErrors({ invalidImage: true });
      this.previewUrl = null;
      this.isLoading = false;
    };
    reader.readAsDataURL(file);
  }

  removeImage(event: MouseEvent): void {
    event.stopPropagation();
    this.previewUrl = null;
    this.file = null;
    this.formGroupRef.get('avatarPath')?.reset();
    this.formGroupRef.get('avatarPath')?.setErrors(null);
  }
}
