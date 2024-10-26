import { Component, inject, TemplateRef } from '@angular/core';
import {
  ModalDismissReasons,
  NgbActiveModal,
  NgbInputDatepicker,
  NgbModal,
} from '@ng-bootstrap/ng-bootstrap';
import { CadastreService } from '../../../../cadastre/services/cadastre.service';
import { Plot } from '../../../../cadastre/plot/models/plot.model';
import { FormsModule } from '@angular/forms';
import { SanctionType } from '../../../sanction-type/models/sanction-type.model';
import { SanctionTypeService } from '../../../sanction-type/services/sanction-type.service';
import { InfractionServiceService } from '../../services/infraction-service.service';
import { InfractionDto } from '../../models/infraction.model';
import { NgClass } from '@angular/common';
import { ToastService } from '../../../../../../../projects/ngx-dabd-grupo01/src/public-api';

@Component({
  selector: 'app-new-infraction-modal',
  standalone: true,
  imports: [NgbInputDatepicker, FormsModule, NgClass],
  templateUrl: './new-infraction-modal.component.html',
  styleUrl: './new-infraction-modal.component.scss',
})
export class NewInfractionModalComponent {
  //services
  activeModal = inject(NgbActiveModal);
  private cadastreService = inject(CadastreService);
  private sanctionService = inject(SanctionTypeService);
  private infractionService = inject(InfractionServiceService);

  toastService = inject(ToastService);

  //variables
  plots: Plot[] | undefined;
  sanctionTypes: SanctionType[] | undefined;

  claims: number[] = [];
  sanctionTypeNumber: number | undefined;
  description: string | undefined;
  plotId: number | undefined;

  // Modal logic
  private modalService = inject(NgbModal);
  closeResult = '';

  open(content: TemplateRef<any>) {
    this.cadastreService.getPlots().subscribe({
      next: (response) => {
        this.plots = response.content;
      },
    });

    this.sanctionService.getPaginatedSanctionTypes(1, 10).subscribe({
      next: (response) => {
        this.sanctionTypes = response.items;
      },
      error: (error) => {},
    });

    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  private getDismissReason(reason: any): string {
    switch (reason) {
      case ModalDismissReasons.ESC:
        return 'by pressing ESC';
      case ModalDismissReasons.BACKDROP_CLICK:
        return 'by clicking on a backdrop';
      default:
        return `with: ${reason}`;
    }
  }

  addClaim(id: number) {
    const index = this.claims.indexOf(id);

    if (index !== -1) {
      this.claims.splice(index, 1);
    } else {
      this.claims.push(id);
    }
  }

  submitInfraction() {
    if (this.plotId && this.sanctionTypeNumber && this.description) {
      const newInfraction: InfractionDto = {
        plotId: this.plotId,
        description: this.description,
        sanctionTypeId: this.sanctionTypeNumber,
        claimsId: this.claims,
      };

      this.infractionService.createInfraction(newInfraction).subscribe({
        next: (response) => {
          this.toastService.sendSuccess('Infracción creada exitosamente');
          this.activeModal.close();
        },
        error: (error) => {
          this.toastService.sendError('Error al crear la infracción');
        },
      });
    } else {
    }
  }
}
