import { Component } from '@angular/core';
import { ConstructionListComponent } from "../construction-list/construction-list.component";
import { LayoutComponent } from '../../../../shared/components/layout/layout.component';

@Component({
  selector: 'app-construction-wrapper',
  standalone: true,
  imports: [LayoutComponent, ConstructionListComponent],
  templateUrl: './construction-wrapper.component.html',
  styleUrl: './construction-wrapper.component.css'
})
export class ConstructionWrapperComponent {

}
