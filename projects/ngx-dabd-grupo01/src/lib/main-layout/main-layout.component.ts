import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NavbarItem } from '../navbar/navbar.model';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { RouterOutlet } from '@angular/router';
import { SidebarItem } from '../sidebar/sidebar.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, SidebarComponent, NavbarComponent, RouterOutlet],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
})
export class MainLayoutComponent {
  @Input() navbarMenu: NavbarItem[] = [];
  @Output() logoutButtonClick = new EventEmitter<void>();

  sidebarMenu: SidebarItem[] = [];
  sidebarTitle: string = '';

  onSidebarChange(newMenu: SidebarItem[], label: string) {
    this.sidebarMenu = newMenu;
    this.sidebarTitle = label;
  }

  onLogoutButtonClick() {
    this.logoutButtonClick.emit();
  }
}
