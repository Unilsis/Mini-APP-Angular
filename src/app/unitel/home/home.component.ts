import { Component } from '@angular/core';
import { WebserviceService } from '../../security/webservice.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GuardUserService } from '../../security/guard-user.service';
import { TimeLoginService } from '../../security/time-login.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from '../../messages/message.service';
 
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  closeResult!: string;
  formularioMotivo!: FormGroup;
  formularioFiltro!: FormGroup;

  subscription: any;
  pageIndex: number = 1;
  pageSize: number = 5;
  totalRecords: number = 0;
  pageNumber: number = 0;
  totalPages: number = 0;

  userData: any; 
  cancellationReason!: string;
  operationIdToCancel!: string;
  dataList: any = {};
  nome_user: string = "";
  isTextareaDisabled = true;
  isLoading = false;
  totalItens: number = 0;
  constructor(
    private actRoute: ActivatedRoute,
    public fb: FormBuilder,
    private router: Router,
    private requestes: WebserviceService,
    private userGuard: GuardUserService,
    private timelogin: TimeLoginService,
    private modalService: NgbModal,
    private translate: TranslateService,
    private message: MessageService
  ) {
    const language = localStorage.getItem("language");
    this.translate.setDefaultLang(language ?? "en");

    this.formularioMotivo = this.fb.group({
      motivo: [null, Validators.required]
    });

    this.formularioFiltro = this.fb.group({
      startDate: [null],
      endDate: [null],
      status: [null],
      agentName: [null],
      agentNumber: [null],
      assistantName: [null]
    });
  }

  ngOnInit() {
    this.timelogin.startInactivityTimer();
    const userData = localStorage.getItem('userData');
    if (userData) {
      const parsedData = JSON.parse(userData);
      this.nome_user = parsedData.name;
    }
    this.loadPayments();
  }

  loadPayments(page_number?: number, data_de?: string) {
      if (page_number) { this.pageIndex = page_number; }

      this.timelogin.resetInactivityTimer();
      const usersession = this.userGuard.getUserData();
      const dataLocalStorage: any = localStorage.getItem("typePayment");
      if(!data_de){
         data_de = this.formularioFiltro.value.startDate;
      }

      this.requestes.GetAll(this.pageIndex, this.pageSize, usersession.accountName, data_de).subscribe((data: any) => {
      this.totalRecords = data.totalRecords;
      this.totalItens = data.data.length;
      this.pageNumber = data.pageNumber;
      this.totalPages = data.totalPages;
      const idDescriptionMap: Record<string, string> = {};
      JSON.parse(dataLocalStorage).forEach((obj: { id: string | number; description: string; }) => {
        idDescriptionMap[obj.id] = obj.description;
      });

      const operations = data.data.map((obj: { paymentTypeId: string | number; }) => {
        return {
          ...obj,
          description: idDescriptionMap[obj.paymentTypeId] || null,
        };
      });
      this.dataList = operations.sort((a: any, b: any) => b.number - a.number);
    });
  }

  nextPage(currentPage: number) {
    let newpage: number = currentPage + 1;
    this.loadPayments(newpage);
  }

  previePage(currentPage: number) {
    let newpage: number = currentPage - 1;
    this.loadPayments(newpage);
  }

  closeModal(modalId: string) {
    this.timelogin.resetInactivityTimer();
    const modal = document.getElementById(modalId);
    modal!.style.display = 'none';
  }

  submitCancellationForm() {
    this.timelogin.resetInactivityTimer();
    let id = this.operationIdToCancel;
    const usersession = this.userGuard.getUserData();
    const data = {
      "userName": usersession.accountName
    };
    this.subscription = this.requestes.CancelOperation(id, this.formularioMotivo.value, data)
      .subscribe({
        next: () => {
          this.modalService.dismissAll();
          this.router.navigateByUrl('/unitel/home');
        },
        error: (erro) => {
          alert("An error occurred. " + erro);
        }
      });
    this.formularioMotivo.reset();
    this.loadPayments();
  }

  submiFilterForm() {
    this.timelogin.resetInactivityTimer();
    if (this.formularioFiltro.dirty) {
      this.subscription = this.requestes.FilterProcess(this.formularioFiltro.value)
        .subscribe(
          {
            next: () => {
              this.router.navigateByUrl('/unitel/home');
            },
            error: (erro) => {
              alert("An error occurred. "+ erro);
            }
          }
        );
    } else {
      alert("Fill in at least one of the fields.");
    }
    const form_filtro = this.formularioFiltro.value;
    this.loadPayments(1, form_filtro.startDate);
  }

  async submitTransf(id_payment: number) {
    this.isLoading = true;
    this.timelogin.resetInactivityTimer();
    const usersession = this.userGuard.getUserData();
    try {
        const data_transf = await this.initTransf(id_payment);
        if (data_transf.succeeded) {
          await this.inform_unitel(usersession.accountName, data_transf.data.transferencyNumber, id_payment);
        }
        this.router.navigateByUrl('/operacaosucess');
    } catch (error) {
      this.message.setMessage(error);
      this.router.navigateByUrl('/recusadaprocess');
    }
  }

  async initTransf(idpayment: number): Promise<any> {
    const usersession = this.userGuard.getUserData();
    const data = {
      "username": usersession.accountName
    }
    return new Promise<any>((resolve, reject) => {
      this.subscription = this.requestes.Inittransf(data, idpayment).subscribe({
        next: (res) => {
          resolve(res);
        },
        error: (erro) => {
          reject(erro.error.errors);
          this.message.setMessage("Process in STARTED state. " + erro.error.errors);
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
      this.requestes.Inform_to_unitel(id_payment, data).subscribe({
        next: (res) => {
          resolve(res.data.referenceId);
        },
        error: (erro) => {
          reject(erro);
          this.message.setMessage("Process in STARTED state. " + erro.error.errors);
        }
      });
    });
  }

  open(content: any, operationId: string) {
    this.timelogin.resetInactivityTimer();
    this.operationIdToCancel = operationId;
    this.cancellationReason = '';
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
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

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
