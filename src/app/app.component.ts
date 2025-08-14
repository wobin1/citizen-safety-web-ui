import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { NotificationService } from './services/notification.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'citizen-safety-web';

  constructor(private router:Router, private notificationService: NotificationService){}

  ngOnInit() {
    // This will initialize the NotificationService and connect to the WebSocket
    // The NotificationService constructor already connects to the WebSocket,
    // so simply referencing it here ensures it's instantiated.
    // If you want to explicitly trigger connection logic, you could expose a method in the service.
    // For now, this ensures the service is initialized.
    this.notificationService;
  }

  // No, this function is not correct.
  // 1. The correct Angular lifecycle hook is ngOnInit, not ngOnit.
  // 2. To use ngOnInit, you should implement the OnInit interface.
  // Here is the corrected version:


}
