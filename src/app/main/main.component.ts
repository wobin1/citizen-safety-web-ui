import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import type { User } from '../services/auth.service';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {

  currentUser$: Observable<User | null>;

  constructor(private router: Router, private authService: AuthService) {
    this.currentUser$ = this.authService.currentUser$;
  }
  // 2. To use ngOnInit, you should implement the OnInit interface.
  // Here is the corrected version:

  ngOnInit() {
    console.log("current route", this.getCurrentRoute());
  }

  route(page:string){

    this.router.navigate(['app/' + page]);
    this.getCurrentRoute()
  }

  getCurrentRoute(): string {

    // The router.url may include query params, so we split at '?' and take the path only
    // Also, if the route is '/', but a redirect is in place, we want the actual active route
    // Use router.urlAfterRedirects if available, else fallback to url
    const url = (this.router as any).urlAfterRedirects || this.router.url;

    return url.split('?')[0];
  }

  logout(): void {
    this.authService.logout();
  }
}
