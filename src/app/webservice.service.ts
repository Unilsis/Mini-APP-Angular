import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment.development';
import { Observable, catchError, of, retry, tap } from 'rxjs';
import { GuardUserService } from './guard-user.service';

@Injectable({
  providedIn: 'root'
})
export class WebserviceService {
  api_spa = environment.api_spa_unitel;
  constructor(
    private http: HttpClient,
    private userGuard: GuardUserService
  ) { }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  ChangeStatusToPaid(data: any, id_payment: number): Observable<any> {
    return this.http.put<any>(this.api_spa + 'payments/' + id_payment, JSON.stringify(data), this.httpOptions).pipe(
      retry(1),
      catchError((error) => {
        return of(this.handleError(error));
      })
    )
  }

  // Filtro
  FilterProcess(data: any): Observable<any> {
    return this.http
      .post<any>(this.api_spa, JSON.stringify(data), this.httpOptions)
      .pipe(
        retry(1),
        tap((response) => {
          this.userGuard.setUserData(response.data);
        }),
        catchError((error) => {
          return of(this.handleError(error));
        })
      );
  }

  Inform_to_unitel(paymentID: number, data: any): Observable<any> {
    return this.http.post<any>(this.api_spa + 'payments/' + paymentID + '/integrate', data, this.httpOptions).pipe(
      retry(1),
      catchError((error) => {
        return of(this.handleError(error));
      })
    )
  }

  // Init Payment
  Payment(data: any): Observable<any> {
    return this.http
      .post<any>(this.api_spa + 'payments', data, this.httpOptions)
      .pipe(
        retry(1),
        catchError((error) => {
          return of(this.handleError(error));
        })
      );
  }

  Inittransf(user: any, idpayment: number): Observable<any> {
    return this.http
      .post<any>(this.api_spa + 'payments/' + idpayment + '/tranfer', user, this.httpOptions).pipe(
        retry(1),
        catchError((error) => {
          return of(this.handleError(error));
        })
      );
  }

  // Verificar Agente
  GetCheckAgent(n_agente: string): Observable<any> {
    return this.http
      .get<any>(this.api_spa + 'agents/?agentNumber=' + n_agente)
      .pipe(
        retry(1),
        catchError((error) => {
          return of(this.handleError(error));
        })
      );
  }

  // LOGIN
  GetLogin(email: string, senha: string): Observable<any> {
    return this.http
      .get<any>(this.api_spa + 'ADUsers?username=' + email + '&password=' + senha)
      .pipe(
        retry(1),
        tap((response) => {
          this.userGuard.setUserData(response.data);
        }),
        catchError((error) => {
          return of(this.handleError(error));
        })
      );
  } 
  
  GetAll(pageNumber: number, pageSize: number, username: string, data_de?: string): Observable<any> {
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, '0');
    const dia = String(hoje.getDate()).padStart(2, '0');
    const dataFormatada = `${ano}-${mes}-${dia}`;
    data_de = data_de ?? dataFormatada;
    return this.http
      .get<any>(this.api_spa + `payments?pageNumber=${pageNumber}&pageSize=${pageSize}&date=${data_de}&username=${username}`)
      .pipe(
        retry(1),
        catchError((error) => {
          return of(this.handleError(error));
        })
      );
  }

  GetTypePayments(): Observable<any> {
    return this.http
      .get<any>(
        this.api_spa + 'paymentsTypes',
        this.httpOptions
      )
      .pipe(
        retry(1),
        catchError((error) => {
          return of(this.handleError(error));
        })
      );
  }
  
  CancelOperation(id: string, form_data: any, data: any): Observable<any> {
    const options = {
      body: data
    };
    return this.http
      .delete<any>(
        this.api_spa + 'payments/' + id, options
      )
      .pipe(retry(1), catchError((error) => {
        return of(this.handleError(error));
      }));
  }

  logout(): void {
    this.userGuard.clearUserData();
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('motivo');
    if (token) {
      return true;
    }
    return false;
  }

  handleError(error: HttpErrorResponse): Observable<any> {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Erro ocorreu no lado do client
      errorMessage = error.error.message;
    } else {
      // Erro ocorreu no lado do servidor
      errorMessage = `Código do erro: ${error.status}, ` + `mensagem: ${error.message}`;
    }
    return of(new Error(`Requisição falhou: ${errorMessage}`));
  }


}
