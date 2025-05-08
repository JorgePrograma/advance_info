import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MockGroupsService {
  users: string[] = ['grupo super administrador', 'radicadores', 'gestores'];
}
