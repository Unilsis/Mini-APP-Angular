import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: []
})
export class AppComponent {
  title = 'Portal de Serviços';
  constructor(private translate: TranslateService) {
    this.translate.setDefaultLang("en");
  }

  switchLanguage(language: string) {
    this.translate.use(language);
  }
}
