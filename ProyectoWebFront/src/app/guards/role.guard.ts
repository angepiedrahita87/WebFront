// src/app/guards/role.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const roleGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  const allowedRoles = (route.data?.['roles'] as string[] | undefined) ?? [];

  // 👇 SSR-safe: en el servidor NO existe window/localStorage
  let currentRole: string | null = null;
  if (typeof window !== 'undefined') {
    try {
      currentRole = localStorage.getItem('auth_role');
    } catch {
      currentRole = null;
    }
  }

  // Si la ruta no tiene data.roles, no hacemos nada especial
  if (allowedRoles.length === 0) {
    return true;
  }

  // Si no hay rol o no está permitido -> redirigir (en browser) y bloquear
  const isAllowed = !!currentRole && allowedRoles.includes(currentRole);

  if (!isAllowed) {
    if (typeof window !== 'undefined') {
      // Solo navegamos en el cliente; en SSR solo devolvemos false
      router.navigate(['/home']);
    }
    return false;
  }

  return true;
};
