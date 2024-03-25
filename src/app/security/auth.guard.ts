import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { GuardUserService } from './guard-user.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const guardUserService = inject(GuardUserService);
  const isLoggedIn = guardUserService.getUserLoginOrLogout();
  if (!isLoggedIn) {
      router.navigate(['/login']);
      return false;
  }
  return true;
};
