import { Component, inject } from '@angular/core';

import { ToastService } from './toast-service';
import { NgTemplateOutlet } from '@angular/common';
import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-toasts',
  standalone: true,
  imports: [NgbToastModule, NgTemplateOutlet],
  template: `
    @for (toast of toastService.toasts; track toast) {
    <ngb-toast
      [class]="toast.classname"
      [autohide]="true"
      [delay]="toast.delay || 5000"
      (hidden)="toastService.remove(toast)"
    >
      @if(toast.message){
      {{ toast.message }}
      }@else{
      <ng-container
        *ngTemplateOutlet="
          toast.template;
          context: { $implicit: toast.context }
        "
      ></ng-container>
      }
    </ngb-toast>
    }
  `,
  host: {
    class: 'toast-container position-fixed top-0 end-0 p-3',
    style: 'z-index: 1200',
  },
})
export class ToastsContainer {
  toastService = inject(ToastService);
}
