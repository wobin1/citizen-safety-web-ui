import { authGuard } from './guards/auth.guard';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { IncidentListComponent } from './incident-list/incident-list.component';
import { IncidentDetailComponent } from './incident-detail/incident-detail.component';
import { LoginComponent } from './login/login.component';
import { MapComponent } from './map/map.component';
import { AuthComponent } from './auth/auth.component';
import { MainComponent } from './main/main.component';
import { AlertListComponent } from './alerts-list/alerts-list.component';
import { AlertsDetailComponent } from './alerts-detail/alerts-detail.component';
import { EmergencyListComponent } from './emergency-list/emergency-list.component';
import { EmergencyDetailComponent } from './emergency-detail/emergency-detail.component';

export const routes: Routes = [
  { path: 'auth', component: AuthComponent, children: [
    { path: 'login', component: LoginComponent },
  ]},
  { path: 'app', component: MainComponent, children: [
    { path: 'dashboard', component: DashboardComponent , canActivate: [authGuard] },
    { path: 'incidents', component: IncidentListComponent , canActivate: [authGuard] },
    { path: 'incidents/:id', component: IncidentDetailComponent , canActivate: [authGuard] },
    { path: 'alerts', component: AlertListComponent , canActivate: [authGuard] },
    { path: 'alerts/:id', component: AlertsDetailComponent , canActivate: [authGuard] },
    { path: 'emergency', component: EmergencyListComponent , canActivate: [authGuard] },
    { path: 'emergency/:id', component: EmergencyDetailComponent , canActivate: [authGuard] },
    { path: 'maps', component: MapComponent , canActivate: [authGuard] },
  ]},
  { path: '', redirectTo: 'app/dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: 'app/dashboard' } // Wildcard for unmatched routes
];
