import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private messageSubject = new BehaviorSubject<string>('');

  getMessage() {
    return this.messageSubject.asObservable();
  }

  setMessage(message: any) {
    this.messageSubject.next(message);
  }
}
