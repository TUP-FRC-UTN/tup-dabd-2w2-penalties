import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { Observable, OperatorFunction } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';
import {JsonPipe, NgClass} from '@angular/common';
import { SanctionType } from '../../models/moderations/sanctionType.model';
import { SanctionTypeService } from '../../services/sanction-type.service';

@Component({
  selector: 'app-sanction-type-select',
  standalone: true,
  imports: [NgbTypeaheadModule, FormsModule, JsonPipe, NgClass],
  templateUrl: './sanction-type-select.component.html',
  styleUrls: ['./sanction-type-select.component.scss'],
})
export class SanctionTypeSelectComponent {
  selectedSanctionType: SanctionType | undefined;

  isSanctionTypeValid: boolean = false;

  @Output() selectedSanctionTypeChange = new EventEmitter<
    SanctionType | undefined
  >();

  constructor(private sanctionService: SanctionTypeService) {}

  search: OperatorFunction<string, readonly SanctionType[]> = (
    text$: Observable<string>
  ) =>
    text$.pipe(
      debounceTime(200),
      switchMap((term) =>
        term.length > 0 ? this.sanctionService.getSanctionTypes(term) : []
      )
    );

  formatter = (x: SanctionType) => x.name;


  onSelectedChange(value: SanctionType) {
    this.selectedSanctionType = value; // Actualiza la propiedad
    this.isSanctionTypeValid = true;
    console.log(
      'Selected sanction type changed to:',
      this.selectedSanctionType
    );
    this.selectedSanctionTypeChange.emit(value); // Emite el nuevo valor
  }

  validateSanctionType(selected: SanctionType|undefined) {
    this.isSanctionTypeValid= !!selected
  }
}
