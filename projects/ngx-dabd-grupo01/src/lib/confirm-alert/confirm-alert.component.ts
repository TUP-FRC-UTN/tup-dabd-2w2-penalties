import { CommonModule } from '@angular/common';
import { Component, inject, Input, TemplateRef } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirm-alert',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirm-alert.component.html',
  styleUrl: './confirm-alert.component.css',
})
export class ConfirmAlertComponent {
  // Inputs:
  @Input() alertTitle: string = 'Confirm';
  @Input() alertType: 'success' | 'danger' | 'warning' | 'info' = 'warning';
  @Input() alertMessage: string = 'Are you sure you want to proceed?';
  
  @Input() contentPlacement: 'top' | 'bottom' = 'bottom';
  @Input() content!: TemplateRef<any>;

  // Services:
  private activeModal = inject(NgbActiveModal);

  onConfirm() {
    this.activeModal.close(true);
  }

  onCancel() {
    this.activeModal.dismiss(false);
  }
}
