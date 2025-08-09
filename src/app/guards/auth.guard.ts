import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { map, take } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  console.log('[authGuard] Checking authentication for route:', state.url);

  return authService.isLoggedIn$.pipe(
    take(1),
    map((isLoggedIn) => {
      console.log('[authGuard] isLoggedIn value:', isLoggedIn);
      if (isLoggedIn) {
        console.log('[authGuard] User is authenticated, allowing access.');
        return true;
      }
      console.log('[authGuard] User is NOT authenticated, redirecting to /auth/login');
      // Return a UrlTree instead of navigating imperatively
      return router.createUrlTree(['/auth/login'], {
        queryParams: { redirect: state.url }
      });
    })
  );
};
