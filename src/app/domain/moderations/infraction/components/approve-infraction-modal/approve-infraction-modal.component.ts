import { Component, inject, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { InfractionServiceService } from '../../services/infraction-service.service';
import { RoleService } from '../../../../../shared/services/role.service';
import { ToastService } from 'ngx-dabd-grupo01';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, NgClass } from '@angular/common';

@Component({
  selector: 'app-approve-infraction-modal',
  standalone: true,
  imports: [FormsModule, NgClass, CommonModule, ReactiveFormsModule],
  templateUrl: './approve-infraction-modal.component.html',
  styleUrl: './approve-infraction-modal.component.scss',
})
export class ApproveInfractionModalComponent {
  @Input() infractionId: number | undefined;

  //services

  private infractionService = inject(InfractionServiceService);
  private roleService = inject(RoleService);

  private toastService = inject(ToastService);

  //variables
  description: string | undefined;

  userId: number | undefined;

  //variable para los archivos
  selectedFiles: File[] = [];

  // Modal logic
  activeModal = inject(NgbActiveModal);

  ngOnInit() {
    this.roleService.currentUserId$.subscribe((userId: number) => {
      this.userId = userId;
    });
  }

  // Método para enviar el formulario de reclamos
  submit() {
    if (this.description && this.userId) {
      const formData = new FormData();

      formData.append('description', 'Aprobación: ' + this.description);
      formData.append('user_id', this.userId.toString());
      formData.append('status', 'APPROVED');

      this.infractionService
        .changeInfractionStatus(formData, this.infractionId!)
        .subscribe({
          next: (response) => {
            this.activeModal.close(response);
            this.toastService.sendSuccess('Se aprobó a la infracción.');
            if (response.fine_id !== null) {
              this.toastService.sendSuccess(
                'Multa ' + response.fine_id + ' creada exitosamente'
              );
            }
          },
          error: (error) => {
            this.toastService.sendError('Error en la aprobación.');
          },
        });
    } else {
      console.error('Faltan datos obligatorios en el formulario');
    }
  }
}
