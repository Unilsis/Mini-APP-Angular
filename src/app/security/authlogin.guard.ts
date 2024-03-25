import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { GuardUserService } from './guard-user.service';

export const authLoginGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const guardUserService = inject(GuardUserService);
  const isLoggedIn = guardUserService.getUserLoginOrLogout();

  if (isLoggedIn) {
      router.navigate(['/unitel/home']);
    return false;
  }
  return true;
};
