import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  Inject,
  ViewChild,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { SignatureCardComponent } from '../signature-card/signature-card.component';
import { NotificationService } from '../../../../shared/services/notification/notification.service';
import { SignatureService } from '../../services/signature/signature.service';
import { SignatureType } from '../signature-card/SignatureType';
import { CanvasService } from '../../services/canvas/canvas.service';
import { firstValueFrom } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatInputModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatDividerModule,
    SignatureCardComponent,
  ],
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
})
export class CreateComponent {

  constructor(
    public dialogRef: MatDialogRef<CreateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { type: SignatureType },
  ) {}

  // Servicios
  private readonly signatureService = inject(SignatureService);
  private readonly canvasService = inject(CanvasService);
  private readonly notificationService = inject(NotificationService);
  // Referencia al canvas
  @ViewChild('canvasElement') canvasElement!: ElementRef<HTMLCanvasElement>;

  // Señales y propiedades
  digitalPassword = '';
  digitalFile?: File;
  rubricaFile?: File;
  digitalPreview = signal<string>('');
  rubricaPreview = signal<string>('');

  // Constantes de validación
  private readonly MAX_FILE_SIZE_KB = 10;
  private readonly REQUIRED_DIMENSIONS = { width: 317, height: 95 };
  private readonly ALLOWED_MIME_TYPES = ['image/jpeg', 'image/jpg'];

  // Manejador de archivos genérico
  private async handleFile(
    file: File,
    type: SignatureType,
    previewSignal: typeof this.digitalPreview | typeof this.rubricaPreview
  ): Promise<void> {
    if (!(await this.validateFile(file, type))) return;

    if (type === 'digital') {
      this.digitalFile = file;
    } else {
      this.rubricaFile = file;
    }

    previewSignal.set(URL.createObjectURL(file));
  }

  // Validación centralizada de archivos
  private async validateFile(file: File, type: SignatureType): Promise<boolean> {
    if (!this.ALLOWED_MIME_TYPES.includes(file.type)) {
      this.notificationService.showError('El formato debe ser JPEG');
      this.clearSignature(type);
      return false;
    }

    if (file.size > this.MAX_FILE_SIZE_KB * 1024) {
      this.notificationService.showError(`El peso máximo es ${this.MAX_FILE_SIZE_KB}KB`);
      this.clearSignature(type);
      return false;
    }

    if (!(await this.validateImageDimensions(file))) {
      this.notificationService.showError(
        `Dimensiones requeridas: ${this.REQUIRED_DIMENSIONS.width}x${this.REQUIRED_DIMENSIONS.height}px`
      );
      this.clearSignature(type);
      return false;
    }

    return true;
  }

  // Manejadores específicos
  handleRubricaFile = (file: File) =>
    this.handleFile(file, 'rubrica', this.rubricaPreview);

  handleDigitalFile = (file: File) =>
    this.handleFile(file, 'digital', this.digitalPreview);

  // Resto del código manteniendo las mismas funcionalidades...
  async saveSignature(type: SignatureType): Promise<void> {
    const formData = new FormData();

    if (type === 'digital') {
      if (!this.digitalFile) {
        this.notificationService.showError('Debe seleccionar un certificado');
        return;
      }
      formData.append('certificate', this.digitalFile);
      formData.append('password', this.digitalPassword);
    } else if (type === 'rubrica') {
      if (!this.canvasService.getCanvasData()) {
        this.notificationService.showError('Debe crear una rúbrica');
        return;
      }
      formData.append('signature', this.canvasService.getCanvasData());
    }

    try {
      const response = await firstValueFrom(
        this.signatureService.uploadSignature(formData, type)
      );
      this.notificationService.showSuccess('Firma guardada');
    } catch (error) {
      this.notificationService.showError('Error al guardar');
    }
  }

  clearSignature(type: SignatureType): void {
    if (type === 'rubrica') {
      this.canvasService.clearCanvas(this.canvasElement.nativeElement);
      this.rubricaPreview.set('');
    } else {
      this.digitalFile = undefined;
      this.digitalPreview.set('');
      this.digitalPassword = '';
    }
  }

  private validateImageDimensions(file: File): Promise<boolean> {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);

      img.onload = () => {
        const isValid =
          img.naturalWidth === this.REQUIRED_DIMENSIONS.width &&
          img.naturalHeight === this.REQUIRED_DIMENSIONS.height;
        URL.revokeObjectURL(img.src);
        resolve(isValid);
      };

      img.onerror = () => resolve(false);
    });
  }


  closeModal(success: boolean = false): void {
    const result = {
      success,
      data: success ? this.getSignatureData() : null,
      type: this.data.type
    };
    this.dialogRef.close(result);
  }

  private getSignatureData(): any {
    return this.data.type === 'digital'
      ? this.digitalFile
      : this.canvasService.getCanvasData();
  }

}
