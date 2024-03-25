import { Component, NgZone } from '@angular/core';
import { GuardUserService } from '../../security/guard-user.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WebserviceService } from '../../security/webservice.service';
import { TimeLoginService } from '../../security/time-login.service';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from '../../messages/message.service';

@Component({
  selector: 'app-newprocess',
  templateUrl: './newprocess.component.html',
  styleUrls: ['./newprocess.component.css']
})
export class NewprocessComponent {
  name_user: string = "";
  formNewPayment!: FormGroup;
  subscription: any;
  blocked: boolean = false;
  isLoading = false;
  yes_tranf = false;
  agent_name: string | undefined;
  notagent: string | undefined;
  progressBarValue: boolean = false;
  constructor(
    private userGuard: GuardUserService,
    private router: Router,
    private formB: FormBuilder,
    private requests: WebserviceService,
    private ngZone: NgZone,
    private timelogin: TimeLoginService,
    private translate: TranslateService,
    private message: MessageService
  ) {
    const language = localStorage.getItem("language");
    this.translate.setDefaultLang(language ?? "en");
  }

  ngOnInit() {
    this.timelogin.startInactivityTimer();

    const userData = localStorage.getItem('userData');
    if (userData) {
      const parsedData = JSON.parse(userData);
      this.name_user = parsedData.name;
    }
    this.formNewPayment = this.formB.group({
        n_agente: [null, Validators.required],
        montante: [null, Validators.required],
        n_conta: [null],
        deposito_transf: [null, Validators.required]
    });
  }

  async submitFormNewPagamento() {
    this.isLoading = true;
    const agent = this.formNewPayment.value;
    this.timelogin.resetInactivityTimer();
    const usersession = this.userGuard.getUserData();

    try {
      let id_payment;

      if (!this.blocked) {
        const typepayment: any = await this.getTypePayment();
        const dep_traanf = agent.deposito_transf == 0 ? "Deposito" : "Transferencia";
        const filteredIds = typepayment.filter((item: { description: string; }) => item.description === dep_traanf).map((item: { id: any; }) => item.id);

        id_payment = await this.initPayment(agent, filteredIds[0]);
        if (id_payment) {
          if (agent.deposito_transf == 1) {
            const data_transf = await this.initTransf(id_payment);
            if (data_transf.succeeded) {
              await this.inform_unitel(usersession.accountName, data_transf.data.transferencyNumber, id_payment);
            }
            this.router.navigateByUrl('/operacaosucess');
          } else {
            this.router.navigateByUrl('/unitel/operacaoprocess/' + id_payment);
          }
        }
      } else if (this.blocked) {
        this.message.setMessage("Blocked user");
        this.router.navigateByUrl('/recusadaprocess');
      }

      this.isLoading = false;
    } catch (error) {
      this.message.setMessage(error);
      this.router.navigateByUrl('/recusadaprocess');
    }
  }

  handleCheckAgenteResult(data: any): void {
    if (data) {
      this.blocked = data.blockedStatus;
      this.agent_name = data.name;
      this.notagent = undefined;
    } else {
      this.notagent = 'yes';
      this.agent_name = undefined;
    }
  }

  async on_checkAgente(valor: any): Promise<any> {
    if (valor.value) {
      this.progressBarValue = true;
      let intervalId: any;
      try {
        const data = await this.checkAgente(valor.value);
        this.handleCheckAgenteResult(data);
        this.progressBarValue = false;
      } catch (error) {
        console.error(error);
        clearInterval(intervalId);
        this.progressBarValue = false;
      }
    }
  }

  async checkAgente(agent_number: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.subscription = this.requests.GetCheckAgent(agent_number).subscribe({
        next: (res) => {
          this.handleCheckAgenteResult(res.data);
          resolve(res.data);
        },
        error: (erro) => {
          this.message.setMessage(erro);
          reject(erro);
          this.router.navigateByUrl('/recusadaprocess');
        }
      });
    });
  }

  async initPayment(agent: any, numer_code: string): Promise<any> {
    const usersession = this.userGuard.getUserData();
    if (!this.blocked) {
      const data_payment = {
        "agentNumber": agent.n_agente,
        "amount": agent.montante,
        "currency": "AKZ",
        "paymentTypeId": numer_code,
        "username": usersession.accountName,
        "clientAccount": agent.n_conta ?? null
      };
      return new Promise<any>((resolve, reject) => {
        this.subscription = this.requests.Payment(data_payment).subscribe({
          next: (res) => {
            resolve(res.data.paymentNumber);
          },
          error: (erro) => {
            reject(erro);
            this.message.setMessage(erro);
          }
        });
      });
    } else {
      this.message.setMessage("Blocked user");
      return null;
    }
  }

  async initTransf(idpayment: number): Promise<any> {
    const usersession = this.userGuard.getUserData();
    const data = {
      "username": usersession.accountName
    }
    return new Promise<any>((resolve, reject) => {
      this.subscription = this.requests.Inittransf(data, idpayment).subscribe({
        next: (res) => {
          resolve(res);
        },
        error: (erro) => {
          reject(erro.error.errors);
          this.message.setMessage("Process in STARTED state. " +erro.error.errors);
        }
      });
    });
  }

  async inform_unitel(user: string, number_operation: number, id_payment: number): Promise<string> {
    const operationDate = new Date().toISOString();
    const data = {
      "operationNumber": number_operation,
      "operationDate": operationDate,
      "userName": user
    }
    return new Promise<string>((resolve, reject) => {
      this.requests.Inform_to_unitel(id_payment, data).subscribe({
        next: (res) => {
          resolve(res.data.referenceId);
        },
        error: (erro) => {
          reject(erro);
          this.message.setMessage("Process in STARTED state. "+erro.error.errors);
        }
      });
    });
  }

  async getTypePayment(): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this.requests.GetTypePayments()
        .subscribe({
          next: (res) => {
            resolve(res.data);
          },
          error: (erro) => {
            reject(erro);
            this.message.setMessage(erro);
          }
        });
    });
  }

  showAccountNumber() {
    this.yes_tranf = true;
  }

  hiddenAccountNumber() {
    this.yes_tranf = false;
  }

  switchLanguage(language: string) {
    this.translate.use(language);
    localStorage.setItem("language", language);
  }

  logoutSystem() {
    this.userGuard.clearUserData();
    this.router.navigateByUrl('/login');
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
