import { PersonnelComponent } from './pages/home/maintenance/personnel/personnel.component';
import { DetailComponent } from './pages/home/fa/detail/detail.component';
import { SummaryComponent } from './pages/home/fa/summary/summary.component';
import { HomeComponent } from './pages/home/home.component';
import { MaintenanceComponent } from './pages/home/maintenance/maintenance.component';
import { FaComponent } from './pages/home/fa/fa.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './AuthGuard/authGuardA';

const fa_part:any=[
  { path: '', redirectTo: 'summary', pathMatch: 'full' },
  { path: 'summary', component: SummaryComponent },
  { path: 'detail', component: DetailComponent },
]

const main_part: any = [
  { path: '', redirectTo: 'fa', pathMatch: 'full' },
  { path: 'fa', component: FaComponent , children: fa_part},
  { path: 'maintenance', component: MaintenanceComponent },
  { path: 'personnel', component: PersonnelComponent },
]

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  // , canActivate: [AuthGuard]
  { path: 'home', component: HomeComponent, children: main_part },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
