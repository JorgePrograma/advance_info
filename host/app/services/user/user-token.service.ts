// user-token.service.ts
import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { TokenDescription, tokenSignal } from '../../interfaces/token-description.model';

@Injectable({ providedIn: 'root' })
export class UserTokenService {
  setToken(token: string) {
    if (token) {
      const decoded: TokenDescription = jwtDecode(token);
      const tokenDescription: TokenDescription = {
        sub: decoded.sub,
        user_id: decoded.user_id,
        user_displayname: decoded.user_displayname
      };
      tokenSignal.set(tokenDescription);
    }
  }
}
