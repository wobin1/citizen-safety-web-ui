// incident-detail.component.ts
import { CommonModule, TitleCasePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MapComponent } from '../map/map.component';
import { IncidentService } from '../services/incident.service';
import { ModalComponent } from '../shared/modal/modal.component';
import { FormsModule } from '@angular/forms';
import { AlertStatusModalComponent } from '../shared/alert-status-modal/alert-status-modal.component';
import { AlertService } from '../services/alert.service';

@Component({
  selector: 'app-incident-detail',
  standalone: true,
  imports: [CommonModule, MapComponent, ModalComponent, FormsModule, AlertStatusModalComponent, TitleCasePipe],
  templateUrl: './incident-detail.component.html',
  styleUrl: './incident-detail.component.scss'
})
export class IncidentDetailComponent implements OnInit {
  incident: any;
  isLoading: boolean = false; // Add isLoading state

  // Modal state for rejection
  showRejectModal: boolean = false;
  rejectionReason: string = '';
  isRejecting: boolean = false;

  // Modal state for validation
  showValidateModal: boolean = false;
  isValidating: boolean = false;

  // State for Trigger Alert dropdown and modal
  showAlertDropdown: boolean = false;
  showAlertModal: boolean = false;
  isAlerting: boolean = false;
  alertTarget: 'neighborhood' | 'citizens' | null = null;

  // Media preview modal state
  showMediaModal: boolean = false;
  selectedMediaType: 'image' | 'video' | 'audio' | null = null;
  selectedMediaUrl: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private incidentService: IncidentService,
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
    this.getDetail();
  }

  getDetail(): void {
    this.route.paramMap.subscribe(params => {
      const incidentId = params.get('id');
      if (incidentId) {
        this.isLoading = true; // Set loading state to true
        this.incidentService.getIncident(incidentId).subscribe({
          next: (incidentData) => {
            this.incident = incidentData.data;
            this.isLoading = false; // Set loading to false on success
          },
          error: (error) => {
            console.error('Failed to fetch incident:', error);
            this.incident = null;
            this.isLoading = false; // Set loading to false on error
          }
        });
      }
    });
  }

  // Action button methods
  openValidateModal(): void {
    this.showValidateModal = true;
  }

  closeValidateModal(): void {
    this.showValidateModal = false;
  }

  confirmValidate(): void {
    if (!this.incident) return;
    this.isValidating = true;
    const payload = {
      "status": "VALIDATED",
      "rejection_reason": null
    };
    this.incidentService.validateIncident(this.incident.id, payload).subscribe({
      next: () => {
        this.incident.status = 'VALIDATED';
        this.closeValidateModal();
      },
      error: (err: any) => {
        alert('Failed to validate incident: ' + (err?.error?.message || 'Unknown error'));
      },
      complete: () => {
        this.isValidating = false;
      }
    });
  }

  openRejectModal(): void {
    this.rejectionReason = '';
    this.showRejectModal = true;
  }

  closeRejectModal(): void {
    this.showRejectModal = false;
    this.rejectionReason = '';
  }

  confirmReject(): void {
    if (!this.incident) return;
    if (!this.rejectionReason || !this.rejectionReason.trim()) {
      alert('Rejection reason is required.');
      return;
    }
    this.isRejecting = true;
    this.incidentService.rejectIncident(this.incident.id, this.rejectionReason).subscribe({
      next: () => {
        this.incident.status = 'REJECTED';
        this.closeRejectModal();
      },
      error: (err: any) => {
        alert('Failed to reject incident: ' + (err?.error?.message || 'Unknown error'));
      },
      complete: () => {
        this.isRejecting = false;
      }
    });
  }

  openDispatchAlertModal(): void {
    this.alertTarget = 'citizens'; // Default to citizens when dispatching
    this.showAlertModal = true;
  }

  closeAlertModal(): void {
    this.showAlertModal = false;
    this.alertTarget = null;
  }

  confirmAlertTrigger(): void {
    if (!this.incident || !this.alertTarget) return;
    this.isAlerting = true;

    const broadcastType = this.alertTarget === 'neighborhood' ? 'broadcast_neighborhood' : 'broadcast_all';

    const alertPayload = {
      "trigger_source": "emergency_service",
      "type": "natural disaster",
      "message": this.incident.description,
      "location_lat": this.incident.latitude, // Use latitude/longitude from incident
      "location_lon": this.incident.longitude,
      "radius_km": 5.0,
      "broadcast_type": broadcastType
    };

    this.alertService.triggerAlert(alertPayload).subscribe({
      next: () => {
        alert(`Alert triggered for ${this.alertTarget === 'neighborhood' ? 'Neighborhood' : 'Citizens'}.`);
        this.isAlerting = false;
        this.closeAlertModal();
      },
      error: (err: any) => {
        alert(err.error);
        console.error(err.error);
        this.isAlerting = false;
        this.closeAlertModal();
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/incidents']);
  }

  // Media preview helpers
  openMedia(type: 'image' | 'video' | 'audio', url: string): void {
    if (!url) return;
    this.selectedMediaType = type;
    this.selectedMediaUrl = url;
    this.showMediaModal = true;
  }

  closeMediaModal(): void {
    this.showMediaModal = false;
    this.selectedMediaType = null;
    this.selectedMediaUrl = '';
  }
}
