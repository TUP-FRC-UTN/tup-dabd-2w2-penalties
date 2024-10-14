import {
  Component,
  EventEmitter,
  inject,
  Output,
  TemplateRef,
} from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FineDTO } from '../../../models/moderations/fineDTO.model';
import { FineStatusEnum } from '../../../models/moderations/fineStatus.enum';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { SanctionTypeSelectComponent } from '../../sanction-type-select/sanction-type-select.component';
import { SanctionType } from '../../../models/moderations/sanctionType.model';
import { FineService } from '../../../services/fine.service';
import { Plot } from '../../../models/plot/plot.model';
import { CadastreService } from '../../../services/cadastre.service';

@Component({
  selector: 'app-new-fine-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, SanctionTypeSelectComponent],
  templateUrl: './new-fine-modal.component.html',
  styleUrls: ['./new-fine-modal.component.scss'],
})
export class NewFineModalComponent {
  @Output() fineCreated = new EventEmitter<number>();
  fine: FineDTO | undefined;
  plots: Plot[] | undefined;

  touchSelected:boolean=false

  error: string | null = null;

  private modalService = inject(NgbModal);
  private fineService = inject(FineService);
  private cadastreService = inject(CadastreService);

  open(content: TemplateRef<any>) {
    this.fine = {
      plotId: undefined,
      sanctionTypeId: undefined,
    };

    this.cadastreService.getPlots().subscribe({
      next: (response) => {
        this.plots = response.content;

        console.log(this.plots);
      },
    });

    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }

  onSanctionTypeChange(value: SanctionType | undefined) {
    this.fine!.sanctionTypeId = value?.id; // Actualiza el tipo de sanción en fine
    this.touchSelected=true
  }

  createFine(form: NgForm) {
    if (form.valid&&this.touchSelected) {
      if (this.fine && this.fine.plotId && this.fine.sanctionTypeId) {
        this.fineService.createFine(this.fine).subscribe({
          next: (response) => {
            this.fineCreated.emit(response?.id);
            this.modalService.dismissAll();
          },
          error: (error) => {
            this.error = `Error al crear la multa ${error}`;

            // Limpia el mensaje después de 3 segundos
            setTimeout(() => {
              this.error = null;
            }, 3000);
          },
        });
      } else {
        this.error = `Complete todos los campos`;
      }
    } else {
      this.validateAllFormFields(form);
    }
  }

  validateAllFormFields(form: NgForm) {
    Object.keys(form.controls).forEach((field) => {
      form.controls[field].markAsTouched({ onlySelf: true });
    });
  }
}
