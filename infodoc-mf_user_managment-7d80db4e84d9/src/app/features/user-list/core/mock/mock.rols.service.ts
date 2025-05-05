import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MockRolsService {
  users: string[] = ['super administrador', 'radicador', 'gestion documentos'];
}
