import { HttpInterceptorFn } from '@angular/common/http';

const authFree = ['/api/auth/login', '/api/auth/register'];

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  if (authFree.some((p) => req.url.includes(p))) {
    return next(req);
  }

  // SSR
  if (typeof window === 'undefined') {
    return next(req);
  }

  const token = window.localStorage.getItem('auth_token');

  if (token) {
    const cleanToken = token.replace(/(\r\n|\n|\r)/gm, '').trim();
    const final = req.clone({
      setHeaders: {
        Authorization: `Bearer ${cleanToken}`
      }
    });
    return next(final);
  }

  return next(req);
};
