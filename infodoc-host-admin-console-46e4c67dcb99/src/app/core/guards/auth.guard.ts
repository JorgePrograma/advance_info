import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { HostService } from '../../services/host.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private _hostService: HostService) {}

  canActivate(): boolean {

    const token = localStorage.getItem('auth_token'); 

    if (token) {
      this._hostService.startTracking();
      return true; 
    } else {
      this.router.navigate(['/login']); 
      console.warn('No token found, redirecting to login...');
      return false; 
    }
  }
}
