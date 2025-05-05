import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
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
onKeyDown($event: KeyboardEvent) {
throw new Error('Method not implemented.');
}
  @Input({ required: true }) formGroupRef!: FormGroup;
  @Input() maxFileSize: number = 5; // MB
  previewUrl: string | ArrayBuffer | null = null;
  isDragging = false;
  file: File | null = null;
  isLoading = false;

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

  private processFile(file: File): void {
    this.isLoading = true;

    // Validar tipo de archivo
    const imageRegex = /image\/(jpeg|png|gif|webp)/;
    if (!imageRegex.exec(file.type)) {
      this.formGroupRef.get('avatarPath')?.setErrors({ invalidImage: true });
      this.previewUrl = null;
      this.isLoading = false;
      return;
    }

    // Validar tamaño
    if (file.size > this.maxFileSize * 1024 * 1024) {
      this.formGroupRef.get('avatarPath')?.setErrors({ fileSize: true });
      this.previewUrl = null;
      this.isLoading = false;
      return;
    }

    this.file = file;

    setTimeout(() => {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.previewUrl = e.target?.result as string;
        this.formGroupRef.get('avatarPath')?.setValue(file.name);
        this.formGroupRef.get('avatarPath')?.setErrors(null);
        this.isLoading = false;
      };
      reader.onerror = () => {
        this.formGroupRef.get('avatarPath')?.setErrors({ invalidImage: true });
        this.previewUrl = null;
        this.isLoading = false;
      };
      reader.readAsDataURL(file);
    }, 800);
  }

  removeImage(event: MouseEvent): void {
    event.stopPropagation();
    this.previewUrl = null;
    this.file = null;
    this.formGroupRef.get('avatarPath')?.reset();
    this.formGroupRef.get('avatarPath')?.setErrors(null);
  }
}
