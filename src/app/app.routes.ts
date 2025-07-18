import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { IncidentListComponent } from './incident-list/incident-list.component';
import { IncidentDetailComponent } from './incident-detail/incident-detail.component';
import { LoginComponent } from './login/login.component';
import { MapComponent } from './map/map.component';
// import { AuthGuard } from './auth.guard'; // For protecting routes

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent /*, canActivate: [AuthGuard]*/ },
  { path: 'incidents', component: IncidentListComponent /*, canActivate: [AuthGuard]*/ },
  { path: 'incidents/:id', component: IncidentDetailComponent /*, canActivate: [AuthGuard]*/ },
  { path: 'maps', component: MapComponent /*, canActivate: [AuthGuard]*/ },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: '/dashboard' } // Wildcard for unmatched routes
];
