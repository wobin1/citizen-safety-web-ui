import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// Import a service for fetching/updating incidents (e.g., IncidentService)
// import { IncidentService } from '../incident.service';
import { MapComponent } from '../map/map.component';
import { IncidentService } from '../services/incident.service';
import { ModalComponent } from '../shared/modal/modal.component';
import { FormsModule } from '@angular/forms';
import { AlertStatusModalComponent } from '../shared/alert-status-modal/alert-status-modal.component';
import { AlertService } from '../services/alert.service';

@Component({
  selector: 'app-incident-detail',
  imports: [CommonModule, MapComponent, ModalComponent, FormsModule, AlertStatusModalComponent],
  templateUrl: './incident-detail.component.html',
  styleUrl: './incident-detail.component.scss'
})
export class IncidentDetailComponent {
  incident: any; // Define a proper interface/type for Incident

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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private incidentService: IncidentService, // Inject your service here
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
    this.getDetail()
  }

  getDetail(){
    this.route.paramMap.subscribe(params => {
      const incidentId = params.get('id');
      if (incidentId) {
        // Fetch incident data from the IncidentService based on incidentId
        // Make sure to inject IncidentService in the constructor and uncomment the import
        this.incidentService.getIncident(incidentId).subscribe(
          (incidentData) => {
            this.incident = incidentData.data;
            console.log(this.incident)
          },
          (error) => {
            console.error('Failed to fetch incident:', error);
            this.incident = null;
          }
        );
        // For now, fallback to null if not found
      }
    });
  }

  // Open the validation modal
  validateIncident(): void {
    this.showValidateModal = true;
  }

  // Close the validation modal
  closeValidateModal(): void {
    this.showValidateModal = false;
  }

  // Confirm validation
  confirmValidate(): void {
    if (!this.incident) return;
    this.isValidating = true;
    let payload: any = {
      "status": "VALIDATED",
      "rejection_reason": null
    }
    this.incidentService.validateIncident(this.incident.id, payload).subscribe({
      next: () => {
        alert('Incident validated successfully.');
        this.incident.status = 'VALIDATED';
        this.closeValidateModal();
        this.getDetail()
      },
      error: (err: any) => {
        alert('Failed to validate incident: ' + (err?.error?.message || 'Unknown error'));
      },
      complete: () => {
        this.isValidating = false;
      }
    });
  }

  // Open the rejection modal
  openRejectModal(): void {
    this.rejectionReason = '';
    this.showRejectModal = true;
  }

  // Close the rejection modal
  closeRejectModal(): void {
    this.showRejectModal = false;
    this.rejectionReason = '';
  }

  // Confirm rejection
  confirmReject(reason: string): void {
    if (!this.incident) return;
    if (!reason || !reason.trim()) {
      alert('Rejection reason is required.');
      return;
    }
    this.isRejecting = true;
    this.incidentService.rejectIncident(this.incident.id, reason).subscribe({
      next: () => {
        alert('Incident rejected successfully.');
        this.incident.status = 'REJECTED';
        this.closeRejectModal();
        this.getDetail()
      },
      error: (err: any) => {
        alert('Failed to reject incident: ' + (err?.error?.message || 'Unknown error'));
      },
      complete: () => {
        this.isRejecting = false;
      }
    });
  }

  rejectIncident(): void {
    // Call service to update incident status to 'rejected'
    console.log('Rejecting incident:', this.incident.id);
    this.incident.status = 'rejected'; // Update UI immediately
    // this.incidentService.updateIncidentStatus(this.incident.id, 'rejected').subscribe(...);
    this.openRejectModal();
  }

  dispatchAlert(): void {
    // Call service to dispatch alert
    console.log('Dispatching alert for incident:', this.incident.id);
    this.incident.status = 'dispatched'; // Update UI immediately
    // this.incidentService.dispatchAlert(this.incident.id).subscribe(...);
  }

  // Trigger Alert Dropdown
  toggleAlertDropdown(): void {
    this.showAlertDropdown = !this.showAlertDropdown;
  }

  openAlertConfirmation(target: 'neighborhood' | 'citizens'): void {
    this.alertTarget = target;
    this.showAlertModal = true;
    this.showAlertDropdown = false;
  }

  closeAlertModal(): void {
    this.showAlertModal = false;
    this.alertTarget = null;
  }

  confirmAlertTrigger(): void {
    if (!this.incident || !this.alertTarget) return;
    this.isAlerting = true;
    console.log("this is incident", this.incident)

    let broadcastType;

    if(this.alertTarget=='neighborhood'){
      broadcastType= 'broadcast_neighborhood'
    }else{
      broadcastType = 'broadcast_all'
    }

    let alertPayload = {
      "trigger_source": "emergency_service",
      "type": "natural disaster",
      "message": this.incident.description,
      "location_lat": this.incident.location_lat,
      "location_lon": this.incident.location_lon,
      "radius_km": 5.0,
      "broadcast_type": broadcastType
    }

    this.alertService.triggerAlert(alertPayload).subscribe(
      res=>{
        alert(`Alert triggered for ${this.alertTarget === 'neighborhood' ? 'Neighborhood' : 'Citizens'}.`);
        this.isAlerting = false;
        this.closeAlertModal();
      },
      err=>{
        alert(err.error)
        console.log(err.error)
        this.isAlerting = false;
        this.closeAlertModal()
      }
    )

  }

  goBack(): void {
    this.router.navigate(['/incidents']);
  }

}
