import { SidebarItem } from '../sidebar/sidebar.model';

export interface NavbarItem {
  label: string;
  routerLink?: string;
  hideItem?: boolean;
  subMenu?: NavbarItem[];
  sidebarMenu?: SidebarItem[];
  badge?: string;
}
