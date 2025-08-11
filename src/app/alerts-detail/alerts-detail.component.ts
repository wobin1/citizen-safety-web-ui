// alert-detail.component.ts
import { CommonModule, TitleCasePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MapComponent } from '../map/map.component';
import { ModalComponent } from '../shared/modal/modal.component';
import { FormsModule } from '@angular/forms';
import { AlertService } from '../services/alert.service'; // Import the AlertService
import { AlertStatusModalComponent } from '../shared/alert-status-modal/alert-status-modal.component';

@Component({
  selector: 'app-alerts-detail',
  standalone: true,
  imports: [CommonModule, MapComponent, ModalComponent, FormsModule, AlertStatusModalComponent, TitleCasePipe],
  templateUrl: './alerts-detail.component.html',
  styleUrl: './alerts-detail.component.scss'
})
export class AlertsDetailComponent implements OnInit {
  alert: any; // Define a proper interface/type for Alert
  isLoading: boolean = false; // Add isLoading state

  // Modal state for resolve
  showResolveModal: boolean = false;
  isResolving: boolean = false;

  // Modal state for cooldown
  showCooldownModal: boolean = false;
  isCoolingDown: boolean = false;

  // Media preview modal state
  showMediaModal: boolean = false;
  selectedMediaType: 'image' | 'video' | 'audio' | null = null;
  selectedMediaUrl: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
    this.getAlertDetail()
  }

  getAlertDetail() {
    this.route.paramMap.subscribe(params => {
      const alertId = params.get('id');
      if (alertId) {
        this.isLoading = true; // Set isLoading to true at the start
        this.alertService.getAlert(alertId).subscribe({
          next: (alertData) => {
            this.alert = alertData.data;
            console.log(this.alert);
            this.isLoading = false; // Set to false on success
          },
          error: (error) => {
            console.error('Failed to fetch alert:', error);
            this.alert = null;
            this.isLoading = false; // Set to false on error
          }
        });
      }
    });
  }

  // Action buttons
  openResolveModal(): void {
    this.showResolveModal = true;
  }

  closeResolveModal(): void {
    this.showResolveModal = false;
  }

  confirmResolve(): void {
    if (!this.alert) return;
    this.isResolving = true;
    this.alertService.resolveAlert(this.alert.id).subscribe({
      next: () => {
        console.log('Alert resolved successfully.');
        this.alert.status = 'RESOLVED';
        this.closeResolveModal();
      },
      error: (err: any) => {
        console.error('Failed to resolve alert:', err);
      },
      complete: () => {
        this.isResolving = false;
      }
    });
  }

  openCooldownModal(): void {
    this.showCooldownModal = true;
  }

  closeCooldownModal(): void {
    this.showCooldownModal = false;
  }

  confirmCooldown(): void {
    if (!this.alert) return;
    this.isCoolingDown = true;
    this.alertService.cooldownAlert(this.alert.id).subscribe({
      next: () => {
        console.log('Alert set to cooldown successfully.');
        this.alert.status = 'COOLDOWN';
        this.closeCooldownModal();
      },
      error: (err: any) => {
        console.error('Failed to set alert to cooldown:', err);
      },
      complete: () => {
        this.isCoolingDown = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/app/alerts']);
  }

  // Media preview helpers
  openMedia(url: string): void {
    if (!url) return;
    // Assuming all photos are images for now. You can extend this logic for videos if needed.
    this.selectedMediaType = 'image';
    this.selectedMediaUrl = url;
    this.showMediaModal = true;
  }

  closeMediaModal(): void {
    this.showMediaModal = false;
    this.selectedMediaType = null;
    this.selectedMediaUrl = '';
  }
}
