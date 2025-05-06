// projects/shared-state/src/lib/shared-state.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedStateService {
  // Aquí creamos un BehaviorSubject para el nombre compartido
  private nombreSource = new BehaviorSubject<string>('Nombre inicial');

  // Observable que exponemos para que los componentes se suscriban
  nombre$ = this.nombreSource.asObservable();

  // Método para actualizar el nombre
  actualizarNombre(nuevoNombre: string): void {
    this.nombreSource.next(nuevoNombre);
  }
}
