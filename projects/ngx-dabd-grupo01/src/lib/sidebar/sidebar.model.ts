export interface SidebarItem {
  label: string;
  routerLink?: string;
  hideItem?: boolean;
  subMenu?: SidebarItem[];
  badge?: string;
  icon?: string;
  hr?: boolean;
}
