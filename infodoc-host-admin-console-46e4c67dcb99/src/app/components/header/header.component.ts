import { Component, ElementRef, ViewChild, HostListener, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserProfileModalComponent } from '../user-profile-modal/user-profile-modal.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@Component({
  selector: 'app-header:not(p)',
  standalone: true,
  imports: [
    // FormsModule is removed as it is not a standalone module
    CommonModule,
    UserProfileModalComponent,
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],

  encapsulation: ViewEncapsulation.ShadowDom,
  host: { 'collision-id': 'HeaderComponent' }, // Atributo único para evitar colisiones
})
export class HeaderComponent {
  isModalOpen = false;
  modalTop = 0;
  modalLeft = 0;

  @ViewChild('userProfile', { static: false }) userProfile!: ElementRef;

  user = {
    name: 'Super Adm Sgdea Infodoc',
    email: 'superadm@adm.com',
    initial: 'S',
    unidadAdministrativa: 'Despacho del ministerio',
    oficina: 'TEST DE ANÁLISIS ECONÓMICO PARA LA SOSTENIBILIDAD',
    cargo: 'Ninguno',
  };
  searchText: string = '';

  openModal() {
    const rect = this.userProfile.nativeElement.getBoundingClientRect();
    this.modalTop = rect.bottom + 10; 
    
    const modalWidth = 384; 
    const windowWidth = window.innerWidth;
    
    let leftPos = rect.left + (rect.width/2) - (modalWidth/2);
    
    leftPos = Math.max(20, leftPos);
    
    if (leftPos + modalWidth > windowWidth - 20) {
      leftPos = windowWidth - modalWidth - 20;
    }
    
    this.modalLeft = leftPos;
    this.isModalOpen = true;
  }
  
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (this.isModalOpen && this.userProfile) {
      const modalElement = document.querySelector('app-user-profile-modal');
      const profileElement = this.userProfile.nativeElement;
      
      if (modalElement && !modalElement.contains(event.target as Node) && 
          !profileElement.contains(event.target as Node)) {
        this.isModalOpen = false;
      }
    }
  }
}