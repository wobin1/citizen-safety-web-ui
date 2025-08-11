import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { NotificationService, Notification } from '../../services/notification.service';

@Component({
  selector: 'app-notification-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification-modal.component.html',
  styleUrls: ['./notification-modal.component.scss']
})
export class NotificationModalComponent implements OnInit, OnDestroy {
  notifications: Notification[] = [];
  isVisible = false;
  private subscription = new Subscription();

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    console.log('Notification modal ngOnInit called');
    this.subscription.add(
      this.notificationService.notifications$.subscribe(notifications => {
        console.log('Received notifications:', notifications);
        this.notifications = notifications;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  show(): void {
    console.log('Notification modal show() called');
    this.isVisible = true;
    console.log('Modal visibility set to:', this.isVisible);
  }

  hide(): void {
    this.isVisible = false;
  }

  markAsRead(notification: Notification): void {
    this.notificationService.markAsRead(notification.id);
  }

  markAllAsRead(): void {
    this.notificationService.markAllAsRead();
  }

  clearAll(): void {
    this.notificationService.clearNotifications();
  }

  getEventTitle(event: string): string {
    switch (event) {
      case 'emergency.reported':
        return 'Emergency Reported';
      case 'emergency.updated':
        return 'Emergency Updated';
      case 'emergency.action_taken':
        return 'Emergency Action Taken';
      case 'incident.reported':
        return 'Incident Reported';
      case 'incident.updated':
        return 'Incident Updated';
      default:
        return event.replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
  }

  getEventIcon(event: string): string {
    switch (event) {
      case 'emergency.reported':
      case 'emergency.updated':
      case 'emergency.action_taken':
        return 'fas fa-exclamation-triangle text-red-500';
      case 'incident.reported':
      case 'incident.updated':
        return 'fas fa-info-circle text-blue-500';
      default:
        return 'fas fa-bell text-gray-500';
    }
  }
}
