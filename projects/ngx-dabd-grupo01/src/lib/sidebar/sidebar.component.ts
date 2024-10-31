import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SidebarItem } from './sidebar.model';
import { NgbCollapse } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, NgbCollapse],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  @Input() menu: SidebarItem[] = [];
  @Input() title: string = '';

  selectedSidebarItem: string = '';
  isOpen: boolean[] = [];

  constructor() {
    this.isOpen = new Array(this.menu.length).fill(false);
  }

  toggleCollapse(index: number, sidebarItem: SidebarItem | undefined): void {
    if (!sidebarItem?.subMenu) {
      this.selectedSidebarItem = sidebarItem?.label || "";
    }

    this.isOpen[index] = !this.isOpen[index];
  }

  selectSidebarItem(item: SidebarItem): void {
    console.log({item});
    
    this.selectedSidebarItem = item.label;
  }
}
