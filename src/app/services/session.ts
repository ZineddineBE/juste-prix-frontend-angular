import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { tap } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  http = inject(HttpClient);

  readonly sessions = signal<Session[]>([]);

  readonly countSession = computed(() => this.sessions().length);
  readonly sessionName = computed(() => this.sessions().map((session) => session.nom));

  getSessions() {
    return this.http
      .get<Session[]>(environment.urlServer + '/sessions')
      .pipe(tap((resultat) => this.sessions.set(resultat)));
  }

  createSession(nomSession: string) {
    const token = localStorage.getItem('jwt');

    return this.http
      .post(environment.urlServer + '/session', { nomSession })
      .pipe(tap(() => this.getSessions().subscribe()));
  }
}
