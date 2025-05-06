import { Component, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { UserService } from '../../services/user/user.service';
import { ComponentComponent } from "../../features/permission/component/component.component";

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    SidebarComponent,
    CommonModule,
    ComponentComponent
],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
  encapsulation: ViewEncapsulation.Emulated,
})
export class LayoutComponent implements OnInit {
crear() {
  window.dispatchEvent(new CustomEvent('rolesChanged', { detail: { roles: ['admin', 'user'] } }));
  
}
  isLoading = false;

  ngOnInit() {
    console.log('Layout component initialized');
  }

  toggleLoader() {
    this.isLoading = !this.isLoading;
    console.log('Loader toggled, new state:', this.isLoading);
  }
}
