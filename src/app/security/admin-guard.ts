import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Authentification } from '../services/authentification';

export const adminGuard: CanActivateFn = (route, state) => {
  const authentification = inject(Authentification);
  const admin = authentification.isAdmin();

  //si l'utilisateur n'est pas admin, on le redirige vers la page d'accueil
  if (!admin) {
    const router = inject(Router);
    return router.createUrlTree(['/home']);
  }

  return true;
};
