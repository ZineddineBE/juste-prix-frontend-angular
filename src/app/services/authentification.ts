import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { tap } from 'rxjs';

// J'imagine que ton interface User ressemble à ça
export interface User {
  email: string;
  password?: string;
  admin?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class Authentification {
  httpClient = inject(HttpClient);

  readonly logged = signal(localStorage.getItem('jwt') !== null);

  // On initialise le signal admin en lisant le token actuel s'il existe
  readonly admin = signal<boolean>(this.checkAdminStatus());

  login(user: User) {
    return this.httpClient.post<{ jwt: string }>(environment.urlServer + '/login', user).pipe(
      tap((result) => {
        localStorage.setItem('jwt', result.jwt);
        this.logged.set(true);

        const decoded = this.decodeToken(result.jwt);
        this.admin.set(decoded?.admin === true);
      }),
    );
  }

  logout() {
    localStorage.removeItem('jwt');
    this.logged.set(false);
  }

  isAdmin() {
    return this.admin();
  }

  private decodeToken(token: string): any {
    try {
      const payloadBase64 = token.split('.')[1];
      const decodedJson = atob(payloadBase64);
      return JSON.parse(decodedJson);
    } catch (e) {
      return null;
    }
  }

  private checkAdminStatus(): boolean {
    const token = localStorage.getItem('jwt');
    if (token) {
      const decoded = this.decodeToken(token);
      return decoded?.admin === true;
    }
    return false;
  }
}
