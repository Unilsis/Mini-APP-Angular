import { Injectable } from '@angular/core';
import { GuardUserService } from './guard-user.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class TimeLoginService {
  private inactivityTimer: any;

  constructor(
    private userGuard: GuardUserService,
    private router: Router
  ) { }

  startInactivityTimer() {
    const inactivityTimeout = 300000;
    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer);
    }

    this.inactivityTimer = setTimeout(() => {
      this.userGuard.clearUserData();
      this.router.navigateByUrl('/login');
    }, inactivityTimeout);
  }

  resetInactivityTimer() {
    clearTimeout(this.inactivityTimer);
    this.startInactivityTimer();
  }

}
