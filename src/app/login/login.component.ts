import { Component, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WebserviceService } from '../security/webservice.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { GuardUserService } from '../security/guard-user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  formularioLogin!: FormGroup;
  errorMesssage: string = '';
  isLoading = false;
  constructor(
    public fb: FormBuilder,
    private ngZone: NgZone,
    private router: Router,
    private requestes: WebserviceService,
    private translate: TranslateService,
    private userGuard: GuardUserService
  ) {
    this.translate.setDefaultLang("en");
    const language = localStorage.getItem("language");
    this.translate.setDefaultLang(language ?? "en");
   }

  switchLanguage(language: string) {
    this.translate.use(language);
    localStorage.setItem("language", language);
  }

  ngOnInit() {
    this.formularioLogin = this.fb.group({
      username: [null, Validators.required],
      password: [null, Validators.required]
    })
  }

  submitLoginForm() {
    if (this.formularioLogin.valid) {
      this.isLoading = true;
        const { username, password } = this.formularioLogin.value;
        this.requestes.GetLogin(username, password).subscribe((res: any) => {
          if (res.succeeded === true) {
              this.ngZone.run(() => this.router.navigateByUrl('/unitel/home'));
              this.requestes.GetTypePayments().subscribe((data: any) => {
                  this.userGuard.setTypePayment(data.data);
                });
          } else {
            this.ngZone.run(() => this.router.navigateByUrl('/login'));
            this.errorMesssage = this.translate.instant('credenciais_errada');
          }
        }).add(() => {
          this.isLoading = false;
        });
    } else {
      this.isLoading = false;
      this.errorMesssage = this.translate.instant('form_invalid');
    }
  }


}
