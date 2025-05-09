import { AbstractControl, ValidatorFn, Validators } from '@angular/forms';
import { PasswordCriteri } from '../../../features/create/model/password-paramater.model';

export class PasswordValidators {
  static createPasswordValidators(criteria: PasswordCriteri): ValidatorFn[] {
    console.log(criteria)
    const validators: ValidatorFn[] = [
      Validators.required,
      this.minimumLengthValidator(criteria.minimumLength),
      this.maximumLengthValidator(criteria.maximumLength),
      this.alphabeticMinimumValidator(criteria.alphabeticMinimum),
      this.numericMinimumValidator(criteria.numericMinimum),
      this.specialMinimumValidator(criteria.specialMinimum),
      this.lowercaseMinimumValidator(criteria.lowercaseMinimum),
      this.uppercaseMinimumValidator(criteria.uppercaseMinimum),
      this.uniqueMinimumValidator(criteria.uniqueMinimum),
      this.repeatedMaximumValidator(criteria.repeatedMaximum),
      this.startsWithAlphanumericValidator(criteria.startsWithAlphanumeric),
      this.requiredCharactersValidator(criteria.requiredCharacters),
      this.whitespacesNotAllowedValidator(criteria.whitespacesNotAllowed),
      this.dictionaryWordsNotAllowedValidator(criteria.dictionaryWordsNotAllowed)
    ];

    if (criteria.charactersNotAllowed) {
      validators.push(this.charactersNotAllowedValidator(criteria.charactersNotAllowed));
    }

    return validators;
  }

  private static minimumLengthValidator(min: number): ValidatorFn {
    return (control) => control.value?.length >= min ? null : {
      minimumLength: { required: min, actual: control.value?.length }
    };
  }

  private static maximumLengthValidator(max: number): ValidatorFn {
    return (control) => control.value?.length <= max ? null : {
      maximumLength: { required: max, actual: control.value?.length }
    };
  }

  private static alphabeticMinimumValidator(min: number): ValidatorFn {
    return (control) => (control.value?.match(/[A-Za-z]/g) || []).length >= min ? null : {
      alphabeticMinimum: { required: min, actual: (control.value?.match(/[A-Za-z]/g) || []).length }
    };
  }

  private static numericMinimumValidator(min: number): ValidatorFn {
    return (control) => (control.value?.match(/[0-9]/g) || []).length >= min ? null : {
      numericMinimum: { required: min, actual: (control.value?.match(/[0-9]/g) || []).length }
    };
  }

  private static specialMinimumValidator(min: number): ValidatorFn {
    return (control) => (control.value?.match(/[^A-Za-z0-9]/g) || []).length >= min ? null : {
      specialMinimum: { required: min, actual: (control.value?.match(/[^A-Za-z0-9]/g) || []).length }
    };
  }

  private static lowercaseMinimumValidator(min: number): ValidatorFn {
    return (control) => (control.value?.match(/[a-z]/g) || []).length >= min ? null : {
      lowercaseMinimum: { required: min, actual: (control.value?.match(/[a-z]/g) || []).length }
    };
  }

  private static uppercaseMinimumValidator(min: number): ValidatorFn {
    return (control) => (control.value?.match(/[A-Z]/g) || []).length >= min ? null : {
      uppercaseMinimum: { required: min, actual: (control.value?.match(/[A-Z]/g) || []).length }
    };
  }

  private static uniqueMinimumValidator(min: number): ValidatorFn {
    return (control) => new Set(control.value?.split('')).size >= min ? null : {
      uniqueMinimum: { required: min, actual: new Set(control.value?.split('')).size }
    };
  }

  private static repeatedMaximumValidator(max: number): ValidatorFn {
    return (control) => {
      if (!control.value) return null;
      const charCounts = control.value.split('').reduce((acc: {[key: string]: number}, char: string) => {
        acc[char] = (acc[char] || 0) + 1;
        return acc;
      }, {});
      const maxCount = Math.max(...(Object.values(charCounts) as number[]));

      return maxCount <= max ? null : {
        repeatedMaximum: { required: max, actual: maxCount }
      };
    };
  }

  private static startsWithAlphanumericValidator(required: boolean): ValidatorFn {
    return (control) => {
      if (!required || !control.value) return null;
      return /^[A-Za-z0-9]/.test(control.value) ? null : { startsWithAlphanumeric: true };
    };
  }

  private static requiredCharactersValidator(chars: string): ValidatorFn {
    return (control) => {
      if (!chars || !control.value) return null;
      const missing = chars.split('').filter(c => !control.value.includes(c));
      return missing.length === 0 ? null : {
        requiredCharacters: { missing: missing.join('') }
      };
    };
  }

  private static whitespacesNotAllowedValidator(notAllowed: boolean): ValidatorFn {
    return (control) => notAllowed && control.value?.includes(' ') ? { whitespacesNotAllowed: true } : null;
  }

  private static dictionaryWordsNotAllowedValidator(notAllowed: boolean): ValidatorFn {
    return (control) => {
      if (!notAllowed || !control.value) return null;
      // Implementar lógica de verificación contra diccionario aquí
      const commonWords = ['password', 'admin', 'user', 'qwerty'];
      return commonWords.some(word => control.value.toLowerCase().includes(word))
        ? { dictionaryWordsNotAllowed: true }
        : null;
    };
  }

  private static charactersNotAllowedValidator(chars: string): ValidatorFn {
    return (control) => {
      if (!chars || !control.value) return null;
      const invalid = chars.split('').some(c => control.value.includes(c));
      return invalid ? { charactersNotAllowed: true } : null;
    };
  }

  static confirmPasswordValidator(passwordControlName: string = 'password'): ValidatorFn {
    return (control: AbstractControl) => {
      if (!control.parent) return null;
      const password = control.parent.get(passwordControlName)?.value;
      return password === control.value ? null : { passwordMismatch: true };
    };
  }
}
