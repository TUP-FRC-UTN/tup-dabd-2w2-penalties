import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
export class NavbarComponent implements OnInit {
  @Input() navbarMenu: NavbarItem[] = [];
  @Input() isSidebarCollapsed: boolean = false;

  @Output() sidebarChange = new EventEmitter<SidebarChangeEvent>();
  @Output() logoutButtonClick = new EventEmitter<void>();
  @Output() profileButtonClick = new EventEmitter<void>();
  @Output() notificationButtonClick = new EventEmitter<void>();

  selectedNavbarItem: string = '';

  ngOnInit(): void {
    const savedItem = localStorage.getItem('selected-navbar-item');
    if (savedItem) {
      this.selectedNavbarItem = savedItem;

      const selectedMenu = this.navbarMenu.find(
        (menu) => menu.label === savedItem
      );
      if (selectedMenu && selectedMenu.sidebarMenu) {
        this.sidebarChange.emit({
          sidebarMenu: selectedMenu.sidebarMenu,
          sidebarTitle: selectedMenu.label,
        });
      }
    }
  }

  selectSidebar(menu: NavbarItem) {
    if (menu.sidebarMenu) {
      this.selectedNavbarItem = menu.label;
      
      localStorage.setItem('selected-navbar-item', menu.label);

      this.sidebarChange.emit({
        sidebarMenu: menu.sidebarMenu,
        sidebarTitle: menu.label,
      });
    }
  }

  onLogoutButtonClick() {
    localStorage.removeItem('selected-navbar-item');
    this.logoutButtonClick.emit();
  }

  onProfileButtonClick() {
    this.profileButtonClick.emit();
  }

  onNotificationButtonClick() {
    this.notificationButtonClick.emit();
  }
}
