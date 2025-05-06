import { signal } from '@angular/core';

export interface TokenDescription {
  sub: string;
  user_id: string;
  user_displayname: string;
}

export const tokenSignal = signal<TokenDescription | null>(null);
