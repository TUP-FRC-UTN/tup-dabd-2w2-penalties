import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavbarItem } from './navbar.model';
import { SidebarItem } from '../sidebar/sidebar.model';
import { CommonModule } from '@angular/common';

interface SidebarChangeEvent {
  sidebarMenu: SidebarItem[];
  sidebarTitle: string;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  @Input() navbarMenu: NavbarItem[] = [];
  @Output() sidebarChange = new EventEmitter<SidebarChangeEvent>();

  selectedNavbarItem: string = '';

  selectSidebar(menu: NavbarItem) {
    if (menu.sidebarMenu) {
      this.selectedNavbarItem = menu.label;
      
      this.sidebarChange.emit({
        sidebarMenu: menu.sidebarMenu,
        sidebarTitle: menu.label,
      });
    }
  }
}
