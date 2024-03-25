import { Component } from '@angular/core';
import { MessageService } from '../messages/message.service';

@Component({
  selector: 'app-recusadapage',
  templateUrl: './recusadapage.component.html',
  styleUrls: ['./recusadapage.component.css']
})
export class RecusadapageComponent {
  message: any = "";
  constructor(private messages: MessageService) { }
  ngOnInit() {
    this.messages.getMessage().subscribe(message => {
      if (message != undefined || message != null) {
          this.message = message;
      }
    });
  }
}
