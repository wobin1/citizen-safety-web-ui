import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, ViewChild, ElementRef, HostListener } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';
import { NotificationModalComponent } from '../shared/notification-modal/notification-modal.component';
import { Observable, Subscription } from 'rxjs';
import type { User } from '../services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NotificationModalComponent, FormsModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent implements OnInit, OnDestroy {

  @ViewChild('notificationModal', { static: false }) notificationModal!: NotificationModalComponent;
  @ViewChild('userDropdown', { static: false }) userDropdown!: ElementRef; // Add ElementRef for the dropdown
  currentUser$: Observable<User | null>;
  unreadCount$: Observable<number>;
  private subscription = new Subscription();
  showDropdown: boolean = false; // New state to control dropdown visibility
  currentUser:any;

  constructor(
    private router: Router,
    private authService: AuthService,
    private notificationService: NotificationService,
    private eRef: ElementRef // Inject ElementRef to listen for clicks outside the component
  ) {
    this.currentUser$ = this.authService.currentUser$;
    this.unreadCount$ = this.notificationService.unreadCount$;
  }

  ngOnInit() {
    console.log("current route", this.getCurrentRoute());
    this.getCurrentUserFromLocalStorage()
  }

  getCurrentUserFromLocalStorage(): void {
    const userString = localStorage.getItem('currentUser');
    if (userString) {
      try {
        this.currentUser = JSON.parse(userString);
        console.log('current user data', this.currentUser)
      } catch (e) {
        console.error('Failed to parse currentUser from localStorage', e);
        this.currentUser = null;
      }
    } else {
      this.currentUser = null;
    }
  }

  route(page: string) {
    this.router.navigate(['app/' + page]);
    this.getCurrentRoute();
  }

  getCurrentRoute(): string {
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
    setTimeout(() => {
      if (this.notificationModal) {
        this.notificationModal.show();
      } else {
        console.error('Notification modal reference is still null after timeout');
      }
    }, 0);
  }

  // Toggle the user dropdown
  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }

  // Close the dropdown when clicking outside
  @HostListener('document:click', ['$event'])
  clickout(event: Event) {
    if (this.userDropdown && !this.userDropdown.nativeElement.contains(event.target)) {
      this.showDropdown = false;
    }
  }
}
