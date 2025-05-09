import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class Validation {
  static nameValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      const valid = /^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]{2,}$/.test(control.value);
      return valid ? null : { invalidName: true };
    };
  }

  static mobileNumberValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      const valid = /^3\d{9}$/.test(control.value);
      return valid ? null : { invalidMobileNumber: true };
    };
  }

  static identificationNumberValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      const valid = /^\d{6,10}$/.test(control.value);
      return valid ? null : { invalidIdentificationNumber: true };
    };
  }

  static emailValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      const valid = /^[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}$/.test(control.value);
      return valid ? null : { invalidEmail: true };
    };
  }

  static addressValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      const valid = /^[A-Za-z0-9\s,.#-]{5,}$/.test(control.value);
      return valid ? null : { invalidAddress: true };
    };
  }

  static telephoneNumberValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      const valid = /^\d{7,12}$/.test(control.value);
      return valid ? null : { invalidTelephoneNumber: true };
    };
  }

  // Método para obtener mensajes de error genéricos
  static getValidationMessage(control: AbstractControl, fieldName: string): string {
    if (control.hasError('required')) {
      return `El campo ${fieldName} es requerido`;
    }

    const errors = control.errors;
    if (!errors) return '';

    switch (Object.keys(errors)[0]) {
      case 'invalidName':
        return 'Debe contener solo letras y al menos 2 caracteres';
      case 'invalidMobileNumber':
        return 'Debe comenzar con 3 y tener 10 dígitos';
      case 'invalidIdentificationNumber':
        return 'Debe tener entre 6 y 10 dígitos';
      case 'invalidEmail':
        return 'Ingrese un email válido (ejemplo@dominio.com)';
      case 'invalidAddress':
        return 'La dirección debe tener al menos 5 caracteres';
      case 'invalidTelephoneNumber':
        return 'Debe tener entre 7 y 12 dígitos';
      default:
        return 'Valor inválido';
    }
  }
}
