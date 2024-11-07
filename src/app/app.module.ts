import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { NavbarComponent } from './components/navbar/navbar.component';
import { BillsComponent } from './components/bills/bills.component';
import { BillsItemsComponent } from './components/bills-items/bills-items.component';
import { BillComponent } from './components/bill/bill.component';
import { BillsDialogComponent } from './bills-dialog/bills-dialog.component'
import { RacunService } from './servicess/racun.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LogInComponent } from './log-in/log-in.component';
import { LayoutComponent } from './layout/layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MatSelectModule } from '@angular/material/select';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatListModule } from '@angular/material/list';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { ProductFilterPipe } from './product-filter.pipe';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbar } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RegisterComponent } from './log-in/register/register.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    BillsComponent,
    BillsItemsComponent,
    BillComponent,
    BillsDialogComponent,
    LogInComponent,
    LayoutComponent,
    DashboardComponent,
    ProductFilterPipe,
    RegisterComponent  ],
  imports: [
    RouterModule,
    BrowserModule,
    AppRoutingModule, 
    HttpClientModule,
    FormsModule,
    BrowserModule,
    ReactiveFormsModule,
    MatFormField,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatFormFieldModule,
    NoopAnimationsModule,
    BrowserAnimationsModule,
    MatListModule,
    MatDatepickerModule,
    MatCardModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule, 
    MatToolbar, 
    MatMenuModule, 
    CommonModule,
    MatSidenavModule
  ],
  providers: [RacunService],
  bootstrap: [AppComponent]
})
export class AppModule { }
