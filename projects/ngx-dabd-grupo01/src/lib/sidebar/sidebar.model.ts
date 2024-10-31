export interface SidebarItem {
  label: string;
  badge?: string;
  routerLink?: string;
  subMenu?: SidebarItem[];
}
