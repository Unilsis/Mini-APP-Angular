import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GuardUserService {
  private userData_storage = 'userData';
  private typePayment_storage = 'typePayment';

  setUserData(userData: any) {
    localStorage.setItem(this.userData_storage, JSON.stringify(userData));
  }

  setTypePayment(data: any) {
    localStorage.setItem(this.typePayment_storage, JSON.stringify(data));
  }

  getUserData() {
    const userDataString = localStorage.getItem(this.userData_storage);
    return userDataString ? JSON.parse(userDataString) : null;
  }

  getPaymentsData() {
    const paymentTypeString = localStorage.getItem(this.typePayment_storage);
    return paymentTypeString ? JSON.parse(paymentTypeString) : null;
  }

  getUserLoginOrLogout() {
    const userDataString = localStorage.getItem(this.userData_storage);
    if (typeof userDataString == 'undefined' || userDataString == 'null' || userDataString == null) {
      return false;
    } else {
      return true;
    }
  }

  clearUserData() {
    localStorage.removeItem(this.userData_storage);
  }

}
