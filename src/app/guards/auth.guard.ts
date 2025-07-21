import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service'; // Ensure this path is correct
import { map, take } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // The guard subscribes to isLoggedIn$ to get the current authentication status.
  // `take(1)` ensures it only takes the first value and then completes, preventing memory leaks.
  return authService.isLoggedIn$.pipe(
    take(1),
    map(isLoggedIn => {
      if (isLoggedIn) {
        // If the user is logged in, allow access to the route
        return true;
      } else {
        // If the user is not logged in, redirect them to the login page
        // and prevent access to the requested route.
        console.log('user not authenticated')
        router.navigate(['auth/login']);
        return false;
      }
    })
  );
};
