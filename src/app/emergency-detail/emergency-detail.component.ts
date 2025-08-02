import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MapComponent } from '../map/map.component';
import { ModalComponent } from '../shared/modal/modal.component';
import { FormsModule } from '@angular/forms';
import { EmergencyService } from '../services/emergency.service'; // Import the EmergencyService

@Component({
  selector: 'app-emergency-detail',
  standalone: true,
  imports: [CommonModule, MapComponent, ModalComponent, FormsModule],
  templateUrl: './emergency-detail.component.html',
  styleUrl: './emergency-detail.component.scss'
})
export class EmergencyDetailComponent {
  emergency: any; // Define a proper interface/type for Emergency

  // Modal state for rejection
  showRejectModal: boolean = false;
  rejectionReason: string = '';
  isRejecting: boolean = false;

  // Modal state for validation
  showValidateModal: boolean = false;
  isValidating: boolean = false;

  // Modal state for Action Taken
  showActionTakenModal: boolean = false;
  isMarkingActionTaken: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private emergencyService: EmergencyService // Inject the EmergencyService here
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const emergencyId = params.get('id');
      if (emergencyId) {
        // Fetch emergency data from the EmergencyService based on emergencyId
        this.emergencyService.getEmergency(emergencyId).subscribe(
          (emergencyData) => {
            this.emergency = emergencyData.data;
            console.log(this.emergency);
          },
          (error) => {
            console.error('Failed to fetch emergency:', error);
            this.emergency = null;
          }
        );
      }
    });
  }

  // Open the validation modal
  validateEmergency(): void {
    this.showValidateModal = true;
  }

  // Close the validation modal
  closeValidateModal(): void {
    this.showValidateModal = false;
  }

  // Confirm validation
  confirmValidateEmergency(): void {
    if (!this.emergency) return;
    this.isValidating = true;
    let payload: any = {
      "status": "VALIDATED",
      "rejection_reason": null // Ensure rejection_reason is null for validation
    };
    this.emergencyService.validateEmergency(this.emergency.id, payload).subscribe({
      next: () => {
        // IMPORTANT: Do NOT use alert(). Use a custom modal or message box instead.
        console.log('Emergency validated successfully.');
        this.emergency.status = 'VALIDATED';
        this.closeValidateModal();
      },
      error: (err: any) => {
        // IMPORTANT: Do NOT use alert(). Use a custom modal or message box instead.
        console.error('Failed to validate emergency:', err);
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
    if (!this.emergency) return;
    if (!reason || !reason.trim()) {
      // IMPORTANT: Do NOT use alert(). Use a custom modal or message box instead.
      console.warn('Rejection reason is required.');
      return;
    }
    this.isRejecting = true;
    this.emergencyService.rejectEmergency(this.emergency.id, reason).subscribe({
      next: () => {
        // IMPORTANT: Do NOT use alert(). Use a custom modal or message box instead.
        console.log('Emergency rejected successfully.');
        this.emergency.status = 'REJECTED';
        this.closeRejectModal();
      },
      error: (err: any) => {
        // IMPORTANT: Do NOT use alert(). Use a custom modal or message box instead.
        console.error('Failed to reject emergency:', err);
      },
      complete: () => {
        this.isRejecting = false;
      }
    });
  }

  // Open the action taken modal
  markActionTaken(): void {
    this.showActionTakenModal = true;
  }

  // Close the action taken modal
  closeActionTakenModal(): void {
    this.showActionTakenModal = false;
  }

  // Confirm action taken
  confirmActionTaken(): void {
    if (!this.emergency) return;
    this.isMarkingActionTaken = true;
    // Assuming your EmergencyService has an updateEmergencyStatus method that can set 'ACTION_TAKEN'
    this.emergencyService.updateEmergencyStatus(this.emergency.id, 'ACTION_TAKEN').subscribe({
      next: () => {
        // IMPORTANT: Do NOT use alert(). Use a custom modal or message box instead.
        console.log('Emergency marked as Action Taken successfully.');
        this.emergency.status = 'ACTION_TAKEN';
        this.closeActionTakenModal();
      },
      error: (err: any) => {
        // IMPORTANT: Do NOT use alert(). Use a custom modal or message box instead.
        console.error('Failed to mark emergency as Action Taken:', err);
      },
      complete: () => {
        this.isMarkingActionTaken = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/emergencies']); // Navigate back to the emergencies list
  }
}
