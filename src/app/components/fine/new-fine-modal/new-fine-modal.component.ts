import { Component, inject, TemplateRef } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Fine } from '../../../models/moderations/fine.model';
import { FineStatusEnum } from '../../../models/moderations/fineStatus.enum';
import { FineDTO } from '../../../models/moderations/fineDTO.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-new-fine-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './new-fine-modal.component.html',
  styleUrl: './new-fine-modal.component.scss',
})
export class NewFineModalComponent {
  createFine() {
    throw new Error('Method not implemented.');
  }
  fine: FineDTO | undefined;

  private modalService = inject(NgbModal);
  closeResult = '';

  open(content: TemplateRef<any>) {
    this.fine = {
      plotId: 0,
      fineState: FineStatusEnum.ON_ASSEMBLY, // Estado inicial por defecto
      sanctionType: undefined, // Objeto SanctionType con valores por defecto
      infractions: [], // Lista vacía de infracciones
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
}
