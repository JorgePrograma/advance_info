import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { catchError, map, Observable, of } from 'rxjs';
import { UserModel } from '../../interfaces/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly profile = signal<UserModel | null>(null);

  getUserById(id: string): Observable<UserModel | null> {
    const url = `http://192.168.1.143:5092/api/v1/users/get_by_filter?userId=${id}`;
    return this.http.get<any>(url).pipe(
      map((res) => {
        // Ajusta según la estructura real de la respuesta
        const user = res?.data?.items?.[0] ?? null;
        console.log('User Response:', user);
        return user;
      }),
      catchError((error) => {
        console.error('Error fetching user:', error);
        return of(null);
      })
    );
  }

  decodeTokenAndSetProfile(token: string) {
    if (token) {
      const decoded: any = jwtDecode(token);
      // Si decoded contiene user_id, llama a getUserById para obtener el usuario
      if (decoded.user_id) {
        this.getUserById(decoded.user_id).subscribe((user) => {
          this.profile.set(user);
        });
      } else {
        // Si no hay user_id, puedes mapear decoded a UserModel o hacer otra acción
        console.log('No se encontró user_id en el token');
      }
    }
  }

  getProfile() {
    return this.profile;
  }
}
