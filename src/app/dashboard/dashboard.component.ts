// dashboard.component.ts
import { Component } from '@angular/core';
import { IncidentService } from '../services/incident.service';
import { CommonModule, DatePipe, SlicePipe, TitleCasePipe } from '@angular/common';
import { Router } from '@angular/router';
import { ModalComponent } from '../shared/modal/modal.component';
import { FormsModule } from '@angular/forms';

// Define a basic interface for your incident, matching what you get from API
interface Incident {
  id: string;
  type: string;
  description?: string;
  location_lat?: number;
  location_lon?: number;
  status: string;
  created_at: string;
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
  stats: IncidentStats | null = null;
  isLoading: boolean = false; // Added isLoading state

  // State for the rejection modal
  showRejectModal: boolean = false;
  incidentToReject: Incident | null = null;
  rejectionReason: string = '';
  isRejecting: boolean = false;

  constructor(private incidentService: IncidentService, private router:Router) {}

  ngOnInit() {
    this.getIncidentStats();
  }


  getIncidentStats() {
    this.isLoading = true; // Set isLoading to true at the start of the request
    this.incidentService.getIncidentStats().subscribe({
      next: (data: any) => {
        this.stats = data.data;
        console.log("stats data", this.stats);
        this.isLoading = false; // Set isLoading to false on success
      },
      error: (err: any) => {
        console.error('Failed to fetch incident stats:', err);
        this.stats = null;
        this.isLoading = false; // Set isLoading to false on error
      }
    });
  }

  route(id: string) {
    console.log('routing to ')
    this.router.navigate(["app/incidents/" + id]);
  }

  openRejectModal(incident: Incident) {
    console.log("opening rejection modal")
    this.incidentToReject = incident;
    this.rejectionReason = '';
    this.showRejectModal = true;
  }

  closeRejectModal() {
    this.showRejectModal = false;
    this.incidentToReject = null;
    this.rejectionReason = '';
  }

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

    this.isRejecting = true;
    this.incidentService.rejectIncident(this.incidentToReject.id, reason).subscribe({
      next: (res: any) => {
        alert('Incident rejected successfully.');
        this.getIncidentStats();
        this.closeRejectModal();
      },
      error: (err: any) => {
        console.error('Failed to reject incident:', err);
        alert('Failed to reject incident: ' + (err?.error?.message || 'Unknown error'));
      },
      complete: () => {
        this.isRejecting = false;
      }
    });
  }

}
