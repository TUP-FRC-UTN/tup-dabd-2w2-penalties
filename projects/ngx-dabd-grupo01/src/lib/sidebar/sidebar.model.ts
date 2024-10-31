export interface SidebarItem {
  label: string;
  routerLink?: string;
  subMenu?: SidebarItem[];
}
