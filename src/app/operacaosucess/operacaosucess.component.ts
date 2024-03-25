import { Component } from '@angular/core';
import { TimeLoginService } from '../security/time-login.service';

@Component({
  selector: 'app-operacaosucess',
  templateUrl: './operacaosucess.component.html',
  styleUrls: ['./operacaosucess.component.css']
})
export class OperacaosucessComponent {
  constructor(private timelogin: TimeLoginService) { }
  ngOnInit() {
    this.timelogin.startInactivityTimer();
  }
}
