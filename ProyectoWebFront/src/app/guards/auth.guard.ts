// src/app/guards/auth.guard.ts
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  // SSR: no hay localStorage, dejamos pasar
  if (typeof window === 'undefined') {
    return true;
  }

  const token = localStorage.getItem('auth_token');

  if (token) {
    return true;
  }

  // sin token -> al login
  return router.parseUrl('/login');
};
