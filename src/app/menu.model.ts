export interface MenuItem {
  label: string;
  icon?: string;
  actionId?: string;
  children?: MenuItem[];
  metadata?: Record<string, any>; // Optional custom configuration payload
}