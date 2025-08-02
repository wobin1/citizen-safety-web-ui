// alert-detail.component.ts
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MapComponent } from '../map/map.component';
import { ModalComponent } from '../shared/modal/modal.component';
import { FormsModule } from '@angular/forms';
import { AlertService } from '../services/alert.service'; // Import the AlertService
import { AlertStatusModalComponent } from '../shared/alert-status-modal/alert-status-modal.component';

@Component({
  selector: 'app-alerts-detail',
  standalone: true,
  imports: [CommonModule, MapComponent, ModalComponent, FormsModule, AlertStatusModalComponent],
  templateUrl: './alerts-detail.component.html',
  styleUrl: './alerts-detail.component.scss'
})
export class AlertsDetailComponent {
  alert: any; // Define a proper interface/type for Alert



  // Modal state for resolve
  showResolveModal: boolean = false;
  isResolving: boolean = false;

  // Modal state for cooldown
  showCooldownModal: boolean = false;
  isCoolingDown: boolean = false;


  // State for Trigger Alert dropdown and modal (might be less relevant for Alert Detail)
  showAlertDropdown: boolean = false;
  showAlertModal: boolean = false;
  isAlerting: boolean = false;
  alertTarget: 'resolve' | 'cooldown' | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private alertService: AlertService // Inject the AlertService here
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const alertId = params.get('id');
      if (alertId) {
        // Fetch alert data from the AlertService based on alertId
        this.alertService.getAlert(alertId).subscribe(
          (alertData) => {
            this.alert = alertData.data;
            console.log(this.alert);
          },
          (error) => {
            console.error('Failed to fetch alert:', error);
            this.alert = null;
          }
        );
      }
    });
  }

  // Open the validation modal
  validateAlert(): void {
    this.showResolveModal = true;
  }

  // Close the validation modal
  closeValidateModal(): void {
    this.showResolveModal = false;
  }

  // Confirm validation



  // Trigger Alert Dropdown (This functionality might be less relevant for an Alert Detail page,
  // as an alert has already been triggered. Consider if you need to re-trigger or trigger related alerts.)
  toggleAlertDropdown(): void {
    this.showAlertDropdown = !this.showAlertDropdown;
  }

  openAlertConfirmation(target: 'resolve' | 'cooldown'): void {
    this.alertTarget = target;
    this.showAlertModal = true;
    this.showAlertDropdown = false;
  }

  closeAlertModal(): void {
    this.showAlertModal = false;
    this.alertTarget = null;
  }

  confirmAlertTrigger(): void {
    if (!this.alert || !this.alertTarget) return;

    this.isAlerting = true;
    // Call your alert service's triggerAlert method here if you want to trigger a *new* alert
    // based on the current alert's context.
    if (this.alertTarget === 'resolve') {
      console.log("resolving alert")
      this.alertService.resolveAlert(this.alert.id).subscribe({
        next: () => {
          this.isAlerting = false;
          this.closeAlertModal();
        }
      });
    } else if (this.alertTarget === 'cooldown') {
      console.log("cooldown alert")
      this.alertService.cooldownAlert(this.alert.id).subscribe({
        next: () => {
          this.isAlerting = false;
          this.closeAlertModal();
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/app/alerts']); // Navigate back to the alerts list
  }
}
