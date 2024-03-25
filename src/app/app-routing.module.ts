import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { ErrorpageComponent } from "./errorpage/errorpage.component";
import { LoginComponent } from "./login/login.component";
import { RecusadapageComponent } from "./recusadapage/recusadapage.component";
import { OperacaosucessComponent } from "./operacaosucess/operacaosucess.component";
import { authGuard } from "./security/auth.guard";
import { authLoginGuard } from "./security/authlogin.guard";

const rotas: Routes = [
      { path: 'unitel', loadChildren: () => import('./unitel/unitel.module').then(m => m.UnitelModule) },
      { path: '', redirectTo: 'unitel', pathMatch: 'full' },
      { path: 'operacaosucess', component: OperacaosucessComponent, canActivate: [authGuard] },
      { path: 'recusadaprocess', component: RecusadapageComponent },
      { path: 'login', component: LoginComponent, canActivate: [authLoginGuard] },
      { path: '**', component: ErrorpageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(rotas)],
  exports: [RouterModule]
})
export class AppRouting { }
