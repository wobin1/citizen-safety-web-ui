import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalComponent {
  @Input() title: string = 'Confirmation';
  @Input() isVisible: boolean = false;
  @Input() confirmButtonText: string = 'Confirm';
  @Input() cancelButtonText: string = 'Cancel';

  // Output for when the modal is closed (without confirmation)
  @Output() close = new EventEmitter<void>();
  // Output for when the modal is confirmed, emitting the reason (if any)
  @Output() confirm = new EventEmitter<string>();

  // Internal state for the input field within the modal
  internalReason: string = '';

  onCancel(): void {
    this.internalReason = ''; // Clear input on cancel
    this.close.emit();
  }

  onConfirm(): void {
    this.confirm.emit(this.internalReason);
    this.internalReason = ''; // Clear input on confirm
  }

  // Prevent clicks inside the modal content from closing the modal
  onModalContentClick(event: Event): void {
    event.stopPropagation();
  }

}
