import { Component, inject } from '@angular/core';
import { Fine } from '../../../models/moderations/fine.model';
import { FineService } from '../../../services/fine.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FineStatusEnum } from '../../../models/moderations/fineStatus.enum';
import { SanctionType } from '../../../models/moderations/sanctionType.model';
import { SanctionTypeSelectComponent } from '../../sanction-type-select/sanction-type-select.component';

@Component({
  selector: 'app-fine-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './fine-detail.component.html',
  styleUrl: './fine-detail.component.scss',
})
export class FineDetailComponent {
  save() {
    console.log(this.fine, this.initialState);
  }

  fineId: number | undefined;
  fine: Fine | undefined;
  initialState: FineStatusEnum | undefined;
  fineService = inject(FineService);
  private route = inject(ActivatedRoute);

  ngOnInit() {
    this.fineId = +this.route.snapshot.paramMap.get('id')!;
    this.fineService.getFineById(this.fineId).subscribe((data) => {
      this.fine = data;
      this.initialState = data.fineState;
    });
  }

  viewInfractionDetail(arg0: number) {
    throw new Error('Method not implemented.');
  }
}
