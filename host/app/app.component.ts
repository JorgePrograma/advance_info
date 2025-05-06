import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, CommonModule],
  template: ` <router-outlet></router-outlet>`,
})
export class AppComponent implements OnInit {

  ngOnInit() {
    console.log('Angular app initialized');
    // Eliminamos el loader inicial
    this.removeInitialLoader();
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
