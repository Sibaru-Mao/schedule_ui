import { ActivateService } from './AuthGuard/activate.service';
import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { HeaderComponent } from './pages/home/header/header.component';
import { FaComponent } from './pages/home/fa/fa.component';
import { MaintenanceComponent } from './pages/home/maintenance/maintenance.component';
import { PersonnelComponent } from './pages/home/maintenance/personnel/personnel.component';
import { SummaryComponent } from './pages/home/fa/summary/summary.component';
import { DetailComponent } from './pages/home/fa/detail/detail.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { zh_CN } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { KeycloakService, KeycloakAngularModule } from 'keycloak-angular';
let configjson = require('../assets/config.json')

registerLocaleData(zh);

function initializeKeycloak(keycloak: KeycloakService) {
  return () =>
    keycloak.init({
      config: {
        url: configjson.wkskeycloak.url,
        realm: configjson.wkskeycloak.realm,
        clientId: configjson.wkskeycloak.clientId,
      },
      initOptions: {
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri:
          window.location.origin + '/assets/silentCheckSso.html',
      },
    });
}
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
    NzModalModule,
    NzDatePickerModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    NzPopoverModule,
    NzTableModule,
    NzUploadModule,
    NzCheckboxModule,
    NzMessageModule,
    KeycloakAngularModule,
  ],
  providers: [
    { provide: NZ_I18N, useValue: zh_CN },
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService],
    },
    ActivateService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
