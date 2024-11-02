import { Component, inject, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from 'ngx-dabd-grupo01';
import { InfractionUpdateDto } from '../../models/infraction.model';
import { InfractionServiceService } from '../../services/infraction-service.service';
import { CommonModule, NgClass } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Plot } from '../../../../cadastre/plot/models/plot.model';
import { ClaimDTO } from '../../../claim/models/claim.model';
import { SanctionType } from '../../../sanction-type/models/sanction-type.model';


@Component({
  selector: 'app-update-infraction',
  standalone: true,
  imports: [CommonModule, FormsModule, NgClass, ReactiveFormsModule],
  templateUrl: './update-infraction.component.html',
  styleUrl: './update-infraction.component.scss'
})
export class UpdateInfractionComponent implements OnInit {


  @Input() infractionId!: number;
  @Input() infraction!: {
    plotId: number;
    description: string;
  };
  plots: Plot[] | undefined;
  sanctionTypes: SanctionType[] | undefined;


  @Input() claims: ClaimDTO[] = [];
  @Input() sanctionTypeNumber: number | undefined;
  @Input() plotId: number | undefined;


  updateData: InfractionUpdateDto = {
    plotId: 0,
    description: ''
  };


  private activeModal = inject(NgbActiveModal);
  private infractionService = inject(InfractionServiceService);
  private toastService = inject(ToastService);


  ngOnInit() {


    if (this.infraction) {
      this.updateData = {
        plotId: this.infraction.plotId,
        description: this.infraction.description
      };
    }


  }
  updateInfraction(): void {
    if (!this.infractionId) {
      this.toastService.sendError('Error: ID de infracción no válido');
      return;
    }


    if (this.updateData.plotId && this.updateData.description) {
      this.infractionService.updateInfraction(this.infractionId, this.updateData)
        .subscribe({
          next: () => {
            this.toastService.sendSuccess('Infracción actualizada exitosamente');
            this.activeModal.close(true);
          },
          error: () => {
            this.toastService.sendError('Error al actualizar la infracción');
          }
        });
    }
  }


  dismiss(): void {
    this.activeModal.dismiss('Cross click');
  }
}
