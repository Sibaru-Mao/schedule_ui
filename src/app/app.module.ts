import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { HeaderComponent } from './pages/home/header/header.component';
import { FaComponent } from './pages/home/fa/fa.component';
import { MaintenanceComponent } from './pages/home/maintenance/maintenance.component';
import { PersonnelComponent } from './pages/home/maintenance/personnel/personnel.component';
import { SummaryComponent } from './pages/home/fa/summary/summary.component';
import { DetailComponent } from './pages/home/fa/detail/detail.component';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

//ngzorro
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { zh_CN } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';

registerLocaleData(zh);
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    FaComponent,
    MaintenanceComponent,
    PersonnelComponent,
    SummaryComponent,
    DetailComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NzSelectModule,
    NzButtonModule,
    NzDatePickerModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    NzPopoverModule
  ],
  providers: [{ provide: NZ_I18N, useValue: zh_CN }],
  bootstrap: [AppComponent]
})
export class AppModule { }
