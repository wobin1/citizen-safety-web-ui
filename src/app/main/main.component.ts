import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';
import { NotificationModalComponent } from '../shared/notification-modal/notification-modal.component';
import { Observable, Subscription } from 'rxjs';
import type { User } from '../services/auth.service';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NotificationModalComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent implements OnInit, OnDestroy {

  @ViewChild('notificationModal', { static: false }) notificationModal!: NotificationModalComponent;
  currentUser$: Observable<User | null>;
  unreadCount$: Observable<number>;
  private subscription = new Subscription();

  constructor(
    private router: Router,
    private authService: AuthService,
    private notificationService: NotificationService
  ) {
    this.currentUser$ = this.authService.currentUser$;
    this.unreadCount$ = this.notificationService.unreadCount$;
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

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.notificationService.disconnect();
  }

  showNotifications(): void {
    console.log('showNotifications() called');
    console.log('notificationModal reference:', this.notificationModal);

    // Use setTimeout to ensure ViewChild is available
    setTimeout(() => {
      if (this.notificationModal) {
        this.notificationModal.show();
      } else {
        console.error('Notification modal reference is still null after timeout');
      }
    }, 0);
  }
}
