import { Component } from '@angular/core';
import { IncidentService } from '../services/incident.service';
import { CommonModule, DatePipe, SlicePipe, TitleCasePipe } from '@angular/common'; // Add TitleCasePipe
import { Router } from '@angular/router';
import { ModalComponent } from '../shared/modal/modal.component'; // Import ModalComponent
import { FormsModule } from '@angular/forms'; // Import FormsModule for ngModel

// Define a basic interface for your incident, matching what you get from API
interface Incident {
  id: string;
  type: string;
  description?: string;
  location_lat?: number;
  location_lon?: number;
  status: string;
  created_at: string; // Assuming it's a string from API
}

// Define a basic interface for your stats response
interface IncidentStats {
  pending: number;
  validated: number;
  rejected: number;
  latest_pending: Incident[];
  // Add other stats properties like dispatched if they exist
}
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [SlicePipe, DatePipe, CommonModule, ModalComponent, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  stats: IncidentStats | null = null; // Use the IncidentStats interface

  // State for the rejection modal
  showRejectModal: boolean = false;
  incidentToReject: Incident | null = null;
  rejectionReason: string = '';
  isRejecting: boolean = false; // To show loading state on reject button

  constructor(private incidentService: IncidentService, private router:Router) {}

  ngOnInit() {
    this.getIncidentStats();
  }


  getIncidentStats() {
    this.incidentService.getIncidentStats().subscribe({
      next: (data: any) => { // Assuming data.data holds the IncidentStats object
        this.stats = data.data;
        console.log("stats data", this.stats);
      },
      error: (err: any) => {
        console.error('Failed to fetch incident stats:', err);
        this.stats = null;
      }
    });
  }

  route(id: string) { // Ensure id is string
    console.log('routing to ')
    this.router.navigate(["app/incidents/" + id]); // Corrected path to match app.routes.ts
  }

  // Method to open the rejection modal
  openRejectModal(incident: Incident) {
    console.log("opening rejection modal")
    this.incidentToReject = incident;
    this.rejectionReason = ''; // Clear previous reason
    this.showRejectModal = true;
  }

  // Method to close the rejection modal
  closeRejectModal() {
    this.showRejectModal = false;
    this.incidentToReject = null;
    this.rejectionReason = '';
  }

  // Method called when the modal's confirm button is clicked
  confirmReject(reason: string) {
    if (!this.incidentToReject) {
      alert('No incident selected for rejection.');
      this.closeRejectModal();
      return;
    }

    if (!reason || !reason.trim()) {
      alert('Rejection reason is required.');
      return;
    }

    this.isRejecting = true; // Start loading
    this.incidentService.rejectIncident(this.incidentToReject.id, reason).subscribe({
      next: (res: any) => {
        alert('Incident rejected successfully.');
        this.getIncidentStats(); // Refresh the stats and list
        this.closeRejectModal(); // Close the modal
      },
      error: (err: any) => {
        console.error('Failed to reject incident:', err);
        alert('Failed to reject incident: ' + (err?.error?.message || 'Unknown error'));
      },
      complete: () => {
        this.isRejecting = false; // End loading
      }
    });
  }

}
