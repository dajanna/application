import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BillsComponent } from './components/bills/bills.component';
import { BillsItemsComponent } from './components/bills-items/bills-items.component';
import { BillComponent } from './components/bill/bill.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LayoutComponent } from './layout/layout.component';
import { LogInComponent } from './log-in/log-in.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AuthGuard } from './guards/auth.guard.spec';
import { RegisterComponent } from './log-in/register/register.component';

const routes: Routes = [

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LogInComponent
  },
  {
    path: 'bills',
    component: BillComponent,
    canActivate: [AuthGuard] // Osigurava da je korisnik prijavljen pre pristupa
  },
  {
    path: 'register',
    component: RegisterComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
