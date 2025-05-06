import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class EventBusService {
  // Emitir datos de usuario a los MFs
  emitUserData(user: any, token: string) {
    window.dispatchEvent(
      new CustomEvent('host-user-data', {
        detail: { user, token }
      })
    );
  }

  // Emitir cambios de permisos
  emitPermissions(permissions: string[]) {
    window.dispatchEvent(
      new CustomEvent('host-permissions', {
        detail: { permissions }
      })
    );
  }
}
