import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { SessionService } from '../../services/session';
import { ProduitService } from '../../services/produit'; // <-- Ajoute cet import
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatInputModule, FormsModule, RouterLink],
  templateUrl: './game.html',
  styleUrl: './game.scss',
})
export class Game implements OnInit {
  route = inject(ActivatedRoute);
  router = inject(Router);
  http = inject(HttpClient);
  sessionService = inject(SessionService);
  produitService = inject(ProduitService);

  gameState = signal<'play' | 'result' | 'leaderboard'>('play');

  session: any = null;
  produits: Produit[] = [];

  produitsSession = signal<Produit[]>([]);

  currentIndex = signal(0);
  prixSaisi = signal<number | null>(null);

  pointsDernierTour = signal(0);
  scoreTotal = signal(0);
  reponsesJoueur: number[] = [];

  ngOnInit() {
    const sessionNom = this.route.snapshot.paramMap.get('nom');

    if (this.sessionService.sessions().length === 0) {
      this.router.navigate(['/home']);
      return;
    }

    const token = localStorage.getItem('jwt');
    let emailJoueur = '';
    if (token) {
      emailJoueur = JSON.parse(atob(token.split('.')[1])).sub;
    }

    this.produitService.getProduits().subscribe({
      next: (prods) => {
        this.produits = prods;
        this.session = this.sessionService.sessions().find((s) => s.nom === sessionNom);

        if (this.session) {
          const produitsTrouves = this.session.produits
            .map((id: number) => this.produits.find((p) => p.id === id))
            .filter((p: any) => p !== undefined);

          this.produitsSession.set(produitsTrouves);

          const moi = this.session.participants.find((p: any) => p.utilisateur === emailJoueur);

          if (moi) {
            this.reponsesJoueur = moi.reponses || [];
            this.scoreTotal.set(moi.score || 0);

            if (this.reponsesJoueur.length >= this.produitsSession().length) {
              this.gameState.set('leaderboard');
            } else {
              this.currentIndex.set(this.reponsesJoueur.length);
              this.gameState.set('play');
            }
          }
        } else {
          this.router.navigate(['/home']);
        }
      },
      error: (err) => {
        console.error('Erreur API Produits:', err);
        this.router.navigate(['/home']);
      },
    });
  }

  validerPrix() {
    const prix = this.prixSaisi() || 0;
    this.reponsesJoueur.push(prix);

    const produitActuel = this.produitsSession()[this.currentIndex()];
    const difference = Math.abs(produitActuel.prix - prix);
    const pointsGagnes = Math.max(0, Math.round(100 - difference));

    this.pointsDernierTour.set(pointsGagnes);
    this.scoreTotal.update((s) => s + pointsGagnes);

    const body = {
      reponses: this.reponsesJoueur,
      score: this.scoreTotal(),
    };

    this.http
      .post(`${environment.urlServer}/session/${this.session.nom}/repondre`, body)
      .subscribe({
        next: (sessionMiseAJour: any) => {
          console.log('Sauvegarde réussie', sessionMiseAJour);
          this.session = sessionMiseAJour;
          this.gameState.set('result');
        },
        error: (err) => {
          console.error('Erreur lors de la sauvegarde du score', err);
        },
      });
  }

  continuer() {
    if (this.currentIndex() < this.produitsSession().length - 1) {
      this.currentIndex.update((i) => i + 1);
      this.prixSaisi.set(null);
      this.gameState.set('play');
    } else {
      this.gameState.set('leaderboard');
    }
  }
}
