import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { NotificationService } from '../../services/notification';
import { Authentification } from '../../services/authentification';
import { SessionService } from '../../services/session';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [MatCardModule, MatButtonModule, MatIconModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  sessionService = inject(SessionService);

  notification = inject(NotificationService);
  authentification = inject(Authentification);

  nomSession = '';
  currentUserEmail = '';

  ngOnInit() {
    const token = localStorage.getItem('jwt');
    if (token) {
      try {
        this.currentUserEmail = JSON.parse(atob(token.split('.')[1])).sub;
      } catch (e) {
        console.error('Erreur de lecture du token');
      }
    }

    this.refreshSessions();
  }

  refreshSessions() {
    this.sessionService.getSessions().subscribe();
  }

  addSession() {
    if (this.nomSession !== '') {
      this.sessionService.createSession(this.nomSession).subscribe({
        next: (response) => {
          this.notification.valid('La session a bien été ajoutée');
        },
        error: (erreur) => {
          if (erreur.status === 400) {
            this.notification.error('Le nom est invalide');
            return;
          } else if (erreur.status === 409) {
            this.notification.error('Ce nom existe déjà');
          } else {
            this.notification.error("Impossible d'ajouter cette session");
          }
        },
      });
    }
  }

  getGameStatus(session: any): 'JOIN' | 'CONTINUE' | 'FINISHED' {
    if (!this.currentUserEmail || !session.participants) return 'JOIN';

    const moi = session.participants.find((p: any) => p.utilisateur === this.currentUserEmail);

    if (!moi) return 'JOIN';

    if (moi.reponses && moi.reponses.length >= session.produits.length) {
      return 'FINISHED';
    }

    return 'CONTINUE';
  }

  getMyScore(session: any): number | null {
    const monEmail = this.currentUserEmail;
    const moi = session.participants.find((p: any) => p.utilisateur === monEmail);
    return moi ? moi.score : null;
  }
}
