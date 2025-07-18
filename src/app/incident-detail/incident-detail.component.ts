import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// Import a service for fetching/updating incidents (e.g., IncidentService)
// import { IncidentService } from '../incident.service';

@Component({
  selector: 'app-incident-detail',
  imports: [CommonModule],
  templateUrl: './incident-detail.component.html',
  styleUrl: './incident-detail.component.scss'
})
export class IncidentDetailComponent {
  incident: any; // Define a proper interface/type for Incident

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    // private incidentService: IncidentService // Inject your service here
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const incidentId = params.get('id');
      if (incidentId) {
        // In a real app, fetch incident data from a service based on incidentId
        // Example static data for demonstration:
        this.incident = {
          id: incidentId,
          type: 'Road Accident',
          description: 'Car vs. Motorcycle, injuries reported. On A1 highway near exit 5.',
          location: 'A1 Highway, Exit 5',
          latitude: 52.3702, // Example coordinates for Amsterdam
          longitude: 4.8952,
          reporter: 'John Doe',
          reportedAt: new Date(Date.now() - 1800000),
          status: 'pending', // Can be 'pending', 'validated', 'rejected', 'false', 'dispatched'
          photos: ['https://via.placeholder.com/150/0000FF/FFFFFF?text=Photo+1', 'https://via.placeholder.com/150/FF0000/FFFFFF?text=Photo+2'] // Example photo URLs
        };
      }
    });
  }

  validateIncident(): void {
    // Call service to update incident status to 'validated'
    console.log('Validating incident:', this.incident.id);
    this.incident.status = 'validated'; // Update UI immediately
    // this.incidentService.updateIncidentStatus(this.incident.id, 'validated').subscribe(...);
  }

  rejectIncident(): void {
    // Call service to update incident status to 'rejected'
    console.log('Rejecting incident:', this.incident.id);
    this.incident.status = 'rejected'; // Update UI immediately
    // this.incidentService.updateIncidentStatus(this.incident.id, 'rejected').subscribe(...);
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
