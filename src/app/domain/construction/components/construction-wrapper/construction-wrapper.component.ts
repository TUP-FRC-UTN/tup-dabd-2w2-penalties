import { Component } from '@angular/core';
import { ConstructionListComponent } from "../construction-list/construction-list.component";

@Component({
  selector: 'app-construction-wrapper',
  standalone: true,
  imports: [ConstructionListComponent],
  templateUrl: './construction-wrapper.component.html',
  styleUrl: './construction-wrapper.component.css'
})
export class ConstructionWrapperComponent {

}
