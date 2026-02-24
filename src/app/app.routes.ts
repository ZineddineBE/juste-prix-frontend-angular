import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { CreateSession } from './pages/create-session/create-session';
import { Game } from './pages/game/game';
import { Page404 } from './pages/page404/page404';
import { loggedGuard } from './security/logged-guard';
import { adminGuard } from './security/admin-guard';

export const routes: Routes = [
  { path: 'home', component: Home, canActivate: [loggedGuard] },
  { path: 'login', component: Login },
  { path: 'create-session', component: CreateSession, canActivate: [loggedGuard, adminGuard] },
  { path: 'game/:nom', component: Game, canActivate: [loggedGuard] },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', component: Page404 },
];
