import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-main-container',
  standalone: true,
  imports: [],
  templateUrl: './main-container.component.html',
  styleUrl: './main-container.component.scss'
})
export class MainContainerComponent {
  @Input() title: string = '';
  @Input() onGoBack?: () => void;

  goBack() {
    this.onGoBack?.();
  }
}
