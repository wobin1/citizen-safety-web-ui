import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// Import a service for fetching/updating incidents (e.g., IncidentService)
// import { IncidentService } from '../incident.service';
import { MapComponent } from '../map/map.component';
import { IncidentService } from '../services/incident.service';
import { ModalComponent } from '../shared/modal/modal.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-incident-detail',
  imports: [CommonModule, MapComponent, ModalComponent, FormsModule],
  templateUrl: './incident-detail.component.html',
  styleUrl: './incident-detail.component.scss'
})
export class IncidentDetailComponent {
  incident: any; // Define a proper interface/type for Incident

  // Modal state for rejection
  showRejectModal: boolean = false;
  rejectionReason: string = '';
  isRejecting: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private incidentService: IncidentService // Inject your service here
  ) { }

  ngOnInit(): void {
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

  validateIncident(): void {
    // Call service to update incident status to 'validated'
    console.log('Validating incident:', this.incident.id);
    this.incident.status = 'validated'; // Update UI immediately
    // this.incidentService.updateIncidentStatus(this.incident.id, 'validated').subscribe(...);
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

  goBack(): void {
    this.router.navigate(['/incidents']);
  }

}
