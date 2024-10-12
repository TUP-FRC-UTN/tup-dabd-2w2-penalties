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
import { FormsModule } from '@angular/forms';
import { SanctionTypeSelectComponent } from '../../sanction-type-select/sanction-type-select.component';
import { SanctionType } from '../../../models/moderations/sanctionType.model';
import { FineService } from '../../../services/fine.service';

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

  error: string | null = null;

  private modalService = inject(NgbModal);
  private fineService = inject(FineService);
  closeResult = '';

  open(content: TemplateRef<any>) {
    this.fine = {
      plotId: 0,
      sanctionTypeId: undefined,
    };

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

  onSanctionTypeChange(value: SanctionType | undefined) {
    this.fine!.sanctionTypeId = value?.id; // Actualiza el tipo de sanción en fine
  }

  createFine() {
    if (this.fine) {
      this.fineService.createFine(this.fine).subscribe({
        next: (response) => {
          console.log('Fine created successfully:', response);
          this.fineCreated.emit(response?.id);
          this.modalService.dismissAll();
        },
        error: (error) => {
          console.error('Error creating fine:', error);
          this.error = `Error al crear la multa ${error}`;

          // Limpia el mensaje después de 3 segundos
          setTimeout(() => {
            this.error = null;
          }, 3000);
        },
      });
    } else {
      console.error('Fine is undefined or null.');
    }
  }
}
