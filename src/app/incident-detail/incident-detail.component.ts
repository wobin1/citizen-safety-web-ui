import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// Import a service for fetching/updating incidents (e.g., IncidentService)
// import { IncidentService } from '../incident.service';
import { MapComponent } from '../map/map.component';
import { IncidentService } from '../services/incident.service';

@Component({
  selector: 'app-incident-detail',
  imports: [CommonModule, MapComponent],
  templateUrl: './incident-detail.component.html',
  styleUrl: './incident-detail.component.scss'
})
export class IncidentDetailComponent {
  incident: any; // Define a proper interface/type for Incident

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
