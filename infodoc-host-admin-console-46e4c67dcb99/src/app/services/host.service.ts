import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class HostService {
  private timeout: any;
  private inactivityLimit = 30 * 60 * 1000; 
  private isTracking = false; 
  constructor(private router: Router) {}

  // Método para iniciar el rastreo de inactividad
  startTracking(): void {
    if (this.isTracking) return; 

    this.isTracking = true;
    console.log('Iniciando rastreo de inactividad...');

    // Escucha eventos globales del usuario
    ['mousemove', 'click', 'keypress', 'scroll'].forEach((event) => {
      window.addEventListener(event, () => this.resetTimer());
    });

    this.resetTimer();
  }

  // Reinicia el temporizador de inactividad
  private resetTimer(): void {
    clearTimeout(this.timeout);
  
    // Establece el temporizador y advertencia
    const warningTime = this.inactivityLimit - 60 * 1000; 
    this.timeout = setTimeout(() => {
      Swal.fire({
        title: 'Inactividad detectada',
        text: 'Tu sesión se cerrará en 1 minuto debido a inactividad.',
        icon: 'warning',
      });  
      this.timeout = setTimeout(() => this.logout(), 60 * 1000);
    }, warningTime);
  }

  // Método para cerrar la sesión
  logout(): void {
    localStorage.clear(); 
    localStorage.removeItem('auth_token'); 
    this.router.navigate(['/login']);
    this.isTracking = false; 
  }
}