import { signal } from '@angular/core';

export interface PasswordParamater {
  data: Data;
  errors: any[];
  statusCode: number;
}

export interface Data {
  minimumLength: number;
  maximumLength: number;
  expiresAfterDays: null;
  accountLockThreshold: number;
  enableAutomaticAccountUnlock: boolean;
  automaticallyUnlockAccountAfterMinutes: null;
  previousPasswordsRemembered: number;
  alphabeticMinimum: number;
  numericMinimum: number;
  specialMinimum: number;
  lowercaseMinimum: number;
  uppercaseMinimum: number;
  uniqueMinimum: number;
  repeatedMaximum: number;
  startsWithAlphanumeric: boolean;
  requiredCharacters: string;
  mustNotContainFirstName: boolean;
  mustNotContainLastName: boolean;
  mustNotContainUsername: boolean;
  charactersNotAllowed: null;
  whitespacesNotAllowed: boolean;
  dictionaryWordsNotAllowed: boolean;
  name: string;
  description: string;
  passwordStrength: string;
  lockoutDuration: number;
  passwordExpiresAfter: number;
}

export const passwordParamaterSignal = signal<PasswordParamater | null>(null);
