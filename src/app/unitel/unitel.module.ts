import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UnitelRoutingModule } from './unitel-routing.module';
import { HomeComponent } from './home/home.component';
import { NewprocessComponent } from './newprocess/newprocess.component';
import { OperacaopageComponent } from './operacaopage/operacaopage.component';
import { HeaderComponent } from './header/header.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

export function httpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    HomeComponent,
    NewprocessComponent,
    OperacaopageComponent,
    HeaderComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatSlideToggleModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    NgbModule,

    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    UnitelRoutingModule,
  ]
})
export class UnitelModule { }
