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
  @Input() alertTitle: string = 'Confirmación';
  @Input() alertType: 'success' | 'danger' | 'warning' | 'info' = 'warning';
  @Input() alertMessage: string = '¿Está seguro de que desea realizar esta accion?';
  @Input() alertVariant: 'default' | 'delete' = 'default';

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
