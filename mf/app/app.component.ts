import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SharedStateService } from 'shared-state';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'mf_user_managment';
  private sharedStateService = inject(SharedStateService);
  
  currentStates: string[] = [];

  ngOnInit(): void {
    this.sharedStateService.state$.subscribe(states => {
      this.currentStates = states;
      console.log('Estado actual:', states); // Muestra en consola
    });
  }
}