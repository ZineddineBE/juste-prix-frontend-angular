import { Component, inject, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { Authentification } from './services/authentification';

@Component({
  selector: 'app-root', // balise appelée dans index.html
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  authentification = inject(Authentification);
}
