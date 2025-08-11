import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Notification {
  id: string;
  event: string;
  data: any;
  timestamp: Date;
  read: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private socket: WebSocket | null = null;
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  private unreadCountSubject = new BehaviorSubject<number>(0);

  public notifications$ = this.notificationsSubject.asObservable();
  public unreadCount$ = this.unreadCountSubject.asObservable();

  constructor() {
    console.log('[NotificationService] Initializing NotificationService');
    this.connectWebSocket();
  }

  private connectWebSocket(): void {
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.warn('[NotificationService] No auth token found, cannot connect to WebSocket');
      return;
    }

    // Connect to the WebSocket endpoint
    console.log('[NotificationService] Connecting to WebSocket at ws://localhost:8000/api/notifications/ws/me');
    this.socket = new WebSocket(`ws://localhost:8000/api/notifications/ws/me`);

    this.socket.onopen = () => {
      console.log('[NotificationService] WebSocket connected, sending authentication token');
      // Send the token as the first message for authentication
      this.socket?.send(JSON.stringify({ token: token }));
    };

    this.socket.onmessage = (event) => {
      console.log('[NotificationService] WebSocket message received:', event.data);
      try {
        const message = JSON.parse(event.data);
        this.addNotification(message);
        console.log(`[Message] ${message}`)
      } catch (error) {
        console.error('[NotificationService] Error parsing WebSocket message:', error, event.data);
      }
    };

    this.socket.onerror = (error) => {
      console.error('[NotificationService] WebSocket error:', error);
    };

    this.socket.onclose = () => {
      console.log('[NotificationService] WebSocket disconnected');
      // Attempt to reconnect after 5 seconds
      setTimeout(() => this.connectWebSocket(), 5000);
    };
  }

  private addNotification(message: any): void {
    console.log('[NotificationService] Adding notification:', message);
    const notification: Notification = {
      id: Date.now().toString(),
      event: message.event,
      data: message.data,
      timestamp: new Date(),
      read: false
    };

    const currentNotifications = this.notificationsSubject.value;
    const updatedNotifications = [notification, ...currentNotifications];
    this.notificationsSubject.next(updatedNotifications);
    this.updateUnreadCount();
    console.log('[NotificationService] Notification added. Total notifications:', updatedNotifications.length);
  }

  private updateUnreadCount(): void {
    const unreadCount = this.notificationsSubject.value.filter(n => !n.read).length;
    this.unreadCountSubject.next(unreadCount);
    console.log('[NotificationService] Updated unread count:', unreadCount);
  }

  markAsRead(notificationId: string): void {
    console.log('[NotificationService] Marking notification as read:', notificationId);
    const currentNotifications = this.notificationsSubject.value;
    const updatedNotifications = currentNotifications.map(n =>
      n.id === notificationId ? { ...n, read: true } : n
    );
    this.notificationsSubject.next(updatedNotifications);
    this.updateUnreadCount();
  }

  markAllAsRead(): void {
    console.log('[NotificationService] Marking all notifications as read');
    const currentNotifications = this.notificationsSubject.value;
    const updatedNotifications = currentNotifications.map(n => ({ ...n, read: true }));
    this.notificationsSubject.next(updatedNotifications);
    this.updateUnreadCount();
  }

  clearNotifications(): void {
    console.log('[NotificationService] Clearing all notifications');
    this.notificationsSubject.next([]);
    this.unreadCountSubject.next(0);
  }

  disconnect(): void {
    if (this.socket) {
      console.log('[NotificationService] Disconnecting WebSocket');
      this.socket.close();
      this.socket = null;
    }
  }
}
