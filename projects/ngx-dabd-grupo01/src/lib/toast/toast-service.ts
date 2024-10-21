import { Injectable, TemplateRef } from '@angular/core';

export interface Toast {
  template?: TemplateRef<any>;
  classname?: string;
  delay?: number;
  context?: any;
  message?: string;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  toasts: Toast[] = [];

  show(toast: Toast) {
    this.toasts.push(toast);
  }

  sendSuccess(message: string) {
    this.show({
      classname: 'bg-success text-light',
      delay: 10000,
      message,
    });
  }

  sendError(message: string) {
    this.show({
      classname: 'bg-danger text-light',
      delay: 10000,
      message,
    });
  }

  remove(toast: Toast) {
    this.toasts = this.toasts.filter((t) => t !== toast);
  }

  clear() {
    this.toasts.splice(0, this.toasts.length);
  }
}
