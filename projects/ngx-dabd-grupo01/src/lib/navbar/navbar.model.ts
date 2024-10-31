import { SidebarItem } from '../sidebar/sidebar.model';

export interface NavbarItem {
  label: string;
  routerLink?: string;
  subMenu?: NavbarItem[];
  sidebarMenu?: SidebarItem[];
}
