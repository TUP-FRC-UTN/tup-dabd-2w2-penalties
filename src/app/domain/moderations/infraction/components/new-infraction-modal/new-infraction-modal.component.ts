import {
  Component,
  ElementRef,
  inject,
  Input,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {
  ModalDismissReasons,
  NgbActiveModal,
  NgbInputDatepicker,
  NgbModal,
} from '@ng-bootstrap/ng-bootstrap';
import { CadastreService } from '../../../../cadastre/services/cadastre.service';
import { Plot } from '../../../../cadastre/plot/models/plot.model';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { SanctionType } from '../../../sanction-type/models/sanction-type.model';
import { SanctionTypeService } from '../../../sanction-type/services/sanction-type.service';
import { InfractionServiceService } from '../../services/infraction-service.service';
import { InfractionDto } from '../../models/infraction.model';
import { CommonModule, NgClass } from '@angular/common';
import { ToastService } from '../../../../../../../projects/ngx-dabd-grupo01/src/public-api';
import { ClaimDTO } from '../../../claim/models/claim.model';
import { TruncatePipe } from '../../../../../shared/pipes/truncate.pipe';

@Component({
  selector: 'app-new-infraction-modal',
  standalone: true,
  imports: [
    NgbInputDatepicker,
    FormsModule,
    NgClass,
    CommonModule,
    ReactiveFormsModule,
    TruncatePipe,
  ],
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

  @Input() claims: ClaimDTO[] = [];
  @Input() sanctionTypeNumber: number | undefined;
  @Input() plotId: number | undefined;

  description: string | undefined;

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

    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
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

  submitInfraction() {
    if (this.plotId && this.sanctionTypeNumber && this.description) {
      const newInfraction: InfractionDto = {
        plotId: this.plotId,
        description: this.description,
        sanctionTypeId: this.sanctionTypeNumber,
        claimsId: this.claims.map((claim) => claim.id),
      };

      this.infractionService.createInfraction(newInfraction).subscribe({
        next: (response) => {
          this.toastService.sendSuccess(
            'Infracción ' + response.id + ' creada exitosamente'
          );
          if (response.fine_id !== null) {
            this.toastService.sendSuccess(
              'Multa ' + response.fine_id + ' creada exitosamente'
            );
          }
          this.activeModal.close(response);
        },
        error: (error) => {
          this.toastService.sendError('Error al crear la infracción');
        },
      });
    } else {
    }
  }
}
