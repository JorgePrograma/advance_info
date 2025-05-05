import { SharedStateService } from 'shared-state';
import { Component, OnInit, inject } from '@angular/core'; // Cambia Inject por inject
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; // Agrega CommonModule

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, CommonModule], // Incluye CommonModule
  template: ` <router-outlet></router-outlet>`,
})
export class AppComponent implements OnInit {
  // Usa la función inject (no el decorador Inject)
  private readonly sharedStateService = inject(SharedStateService);
  
  nombre: string = '';
  nuevoNombre: string = '';
  
  ngOnInit() {
    console.log('Angular app initialized');

    // Eliminamos el loader inicial
    this.removeInitialLoader();
    this.sharedStateService.nombre$.subscribe((nombre: string) => {
      this.nombre = nombre;
    });
  }

  actualizarNombre(): void {
    this.sharedStateService.actualizarNombre(this.nuevoNombre);
    this.nuevoNombre = '';
  }

  // Método para eliminar el loader inicial
  private removeInitialLoader() {
    const initialLoader = document.getElementById('initialLoader');
    if (initialLoader) {
      initialLoader.style.opacity = '0';
      initialLoader.style.transition = 'opacity 0.3s';

      setTimeout(() => {
        initialLoader.remove();
      }, 300);
    }
  }
}
