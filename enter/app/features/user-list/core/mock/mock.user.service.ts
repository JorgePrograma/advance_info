import { Injectable } from '@angular/core';
import { UserModel } from '../../../../shared/interfaces/user.model';

@Injectable({
  providedIn: 'root'
})
export class MockUserService {

  users: UserModel[] = [
    {
      id: 1,
      name: 'John',
      lastName: 'Doe',
      identificationNumber: '123456',
      email: 'john@example.com',
      status: 'habilitado',
      role: 'super administrador',
      group: 'grupo super administrador'
    },
    {
      id: 2,
      name: 'Jane',
      lastName: 'Doe',
      identificationNumber: '789012',
      email: 'jane@example.com',
      status: 'deshabilitado',
      role: 'radicador',
      group: 'radicadores'
    },
    {
      id: 3,
      name: 'Jane',
      lastName: 'Doe',
      identificationNumber: '789011',
      email: 'jane@example.com',
      status: 'bloqueado',
      role: 'gestion documentos',
      group: 'gestores'
    },
    {
      id: 4,
      name: 'Jane',
      lastName: 'Doe',
      identificationNumber: '789013',
      email: 'jane@example.com',
      status: 'suspendido',
      role: 'super administrador',
      group: 'grupo super administrador'
    },
    {
      id: 5,
      name: 'Jane',
      lastName: 'Doe',
      identificationNumber: '789014',
      email: 'jane@example.com',
      status: 'habilitado',
      role: 'radicador',
      group: 'radicadores'
    },
    {
      id: 6,
      name: 'Jane',
      lastName: 'Doe',
      identificationNumber: '789015',
      email: 'jane@example.com',
      status: 'deshabilitado',
      role: 'gestion documentos',
      group: 'gestores'
    },
    {
      id: 7,
      name: 'Jane',
      lastName: 'Doe',
      identificationNumber: '789016',
      email: 'jane@example.com',
      status: 'bloqueado',
      role: 'super administrador',
      group: 'grupo super administrador'
    },
  ];

}
