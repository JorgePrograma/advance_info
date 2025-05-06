import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MockStatusService {
  users: string[] = ['habilitado', 'deshabilitado', 'bloqueado', 'suspendido'];
}
