import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor() {}

  showSuccess(message: string): void {
    Swal.fire({
      title: 'Éxito!',
      text: message,
      icon: 'success',
      confirmButtonText: 'Aceptar',
    });
  }

  showError(message: string): void {
    Swal.fire({
      title: 'Error!',
      text: message,
      icon: 'error',
      confirmButtonText: 'Aceptar',
    });
  }

  showLoading(message: string): void {
    Swal.fire({
      title: message,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
  }

  showFormErrors(errors: string[]): void {
    Swal.fire({
      title: 'Error!',
      html: `Por favor, revisa los campos del formulario:<br><br>${errors.join(
        '<br>'
      )}`,
      icon: 'error',
      confirmButtonText: 'Aceptar',
    });
  }

  // Nuevo método para confirmaciones
  async showConfirmation(
    title: string,
    text: string,
    confirmButtonText: string = 'Sí, confirmar',
    cancelButtonText: string = 'Cancelar'
  ): Promise<boolean> {
    const result = await Swal.fire({
      title,
      text,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText,
      cancelButtonText,
    });

    return result.isConfirmed;
  }
}
