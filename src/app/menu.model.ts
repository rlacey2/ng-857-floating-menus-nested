export interface MenuItem {
  label: string;
  icon?: string;
  actionId?: string;
  children?: MenuItem[];
}