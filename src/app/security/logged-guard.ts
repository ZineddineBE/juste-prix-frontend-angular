import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const loggedGuard: CanActivateFn = (route, state) => {
  const logged = localStorage.getItem('jwt');

  //si l'utilisateur n'est pas connecté, on le redirige vers la page de login
  if (!logged) {
    const router = inject(Router);
    return router.createUrlTree(['/login']);
  }

  return true;
};
