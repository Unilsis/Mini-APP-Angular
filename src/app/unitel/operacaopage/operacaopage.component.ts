import { Component } from '@angular/core';
import { TimeLoginService } from '../../security/time-login.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WebserviceService } from '../../security/webservice.service';
import { GuardUserService } from '../../security/guard-user.service';
import { MessageService } from '../../messages/message.service';

@Component({
  selector: 'app-operacaopage',
  templateUrl: './operacaopage.component.html',
  styleUrls: ['./operacaopage.component.css']
})
export class OperacaopageComponent {
  id_payment!: number;
  formOperation!: FormGroup;
  subscription: any;
  isLoading = false;

  constructor(
    private timelogin: TimeLoginService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private requests: WebserviceService,
    private message: MessageService,
    private userGuard: GuardUserService,

  ) { }

  ngOnInit() {
    this.timelogin.startInactivityTimer();
    this.id_payment = Number(this.route.snapshot.paramMap.get('id'));
    this.formOperation = this.fb.group({
      n_operacao: [null, Validators.required]
    });
  }

  async submitOperation() {
    this.timelogin.resetInactivityTimer();
    this.isLoading = true;
    try {
      const paid_out = await this.paid_out();
      if (paid_out) {
          const info_unitel = await this.inform_unitel();
          if (info_unitel) {
            this.update_for_informed(info_unitel);
            this.router.navigateByUrl('/operacaosucess');
          }
      }
    } catch (error) {
      this.message.setMessage(error);
      this.router.navigateByUrl('/recusadaprocess');
    }
  }

  async paid_out(): Promise<boolean> {
    const data = {
      "operationNumber": this.formOperation.value.n_operacao,
      "sapReferenceNumber": null
    }
    return new Promise<boolean>((resolve, reject) => {
      this.requests.ChangeStatusToPaid(data, this.id_payment)
        .subscribe({
          next: (res) => {
            resolve(res.data);
          },
          error: (error) => {
            this.message.setMessage(error.statusText);
            this.router.navigateByUrl('/recusadaprocess');
          }
        });
    });
  }

  async inform_unitel(): Promise<string> {
    const usersession = this.userGuard.getUserData();
    const operationDate = new Date().toISOString();
    const data = {
      "operationNumber": this.formOperation.value.n_operacao,
      "operationDate": operationDate,
      "userName": usersession.accountName
    }
    return new Promise<string>((resolve, reject) => {
      this.requests.Inform_to_unitel(this.id_payment, data)
        .subscribe({
          next: (res) => {
            resolve(res.data.referenceId);
          },
          error: (error) => {
            this.message.setMessage(error.statusText);
            reject(error);
            this.router.navigateByUrl('/recusadaprocess');
          }
        });
    });
  }

  async update_for_informed(sap_ref: string): Promise<any> {
    const data = {
      "operationNumber": this.formOperation.value.n_operacao,
      "sapReferenceNumber": sap_ref
    }
    return new Promise<any>((resolve, reject) => {
      this.requests.ChangeStatusToPaid(data, this.id_payment)
        .subscribe({
          next: (res) => {
            resolve(res);
          },
          error: (erro) => {
            this.message.setMessage(erro);
            reject(erro);
            this.router.navigateByUrl('/recusadaprocess');
          }
        });
    });
  }

  ngOnDestroy() {
    this.timelogin.resetInactivityTimer();
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
