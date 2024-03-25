import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { GuardUserService } from '../../security/guard-user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: []
})
export class HeaderComponent {

  nome_user: string = "";

  constructor(
    private router: Router,
    private userGuard: GuardUserService,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    const userData = localStorage.getItem('userData');
    if (userData) {
      const parsedData = JSON.parse(userData);
      this.nome_user = parsedData.name;
    }
  }

  switchLanguage(language: string) {
    this.translate.use(language);
    localStorage.setItem("language", language);
  }

  logoutSystem() {
    this.userGuard.clearUserData();
    this.router.navigateByUrl('/login');
  }

  getManualLink(): string {
    const language: string = localStorage.getItem("language") ?? "en";
    return 'assets/docs/' + language +'/manual.pdf';
  }

}
