import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { NewprocessComponent } from './newprocess/newprocess.component';
import { OperacaopageComponent } from './operacaopage/operacaopage.component';
import { authGuard } from "../security/auth.guard";

const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [authGuard] },
  { path: 'home', component: HomeComponent, canActivate: [authGuard] },
  { path: 'newprocess', component: NewprocessComponent, canActivate: [authGuard] },
  { path: 'operacaoprocess/:id', component: OperacaopageComponent, canActivate: [authGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UnitelRoutingModule { }
