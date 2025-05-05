import { Component, Input, Output, EventEmitter, HostBinding, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-profile-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-profile-modal.component.html',
  styleUrls: ['./user-profile-modal.component.css'],
  encapsulation: ViewEncapsulation.Emulated, // Aseguramos encapsulación de estilos

})
export class UserProfileModalComponent {
  @Input() user: any;
  @Input() top: number = 0;
  @Input() left: number = 0;
  @Output() close = new EventEmitter<void>();
  
  @HostBinding('style.top.px')  
  get topPosition() {
    return this.top;
  }
  
  @HostBinding('style.left.px')
  get leftPosition() {
    return this.left;
  }

  constructor(private router: Router) {}

  closeModal() {
    this.close.emit();
  }

  logOut(): void {
    localStorage.removeItem('auth_token'); 
    this.router.navigate(['/login']);
  }

}