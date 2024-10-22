import {
  Component,
  EventEmitter,
  inject,
  Output,
  TemplateRef,
} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { SanctionTypeSelectComponent } from '../../../sanction-type/components/sanction-type-select/sanction-type-select.component';
import { FineService } from '../../services/fine.service';
import { CadastreService } from '../../../../cadastre/services/cadastre.service';
import { FineDTO } from '../../models/fine-dto.model';
import { Plot } from '../../../../cadastre/plot/models/plot.model';
import { SanctionType } from '../../../sanction-type/models/sanction-type.model';

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

  touchSelected: boolean = false;

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
      },
    });

    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }

  onSanctionTypeChange(value: SanctionType | undefined) {
    this.fine!.sanctionTypeId = value?.id; // Actualiza el tipo de sanción en fine
    this.touchSelected = true;
  }

  createFine(form: NgForm) {
    if (form.valid && this.touchSelected) {
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
