import { InventoryItem } from '../types';

export const getStockStatus = (item: InventoryItem): { label: string; color: 'error' | 'warning' | 'success' } => {
  if (item.quantity <= item.minimumStock) return { label: 'Low Stock', color: 'error' };
  if (item.quantity <= item.minimumStock * 1.5) return { label: 'Medium Stock', color: 'warning' };
  return { label: 'Good Stock', color: 'success' };
};

export const isExpiringSoon = (expirationDate?: string): boolean => {
  if (!expirationDate) return false;
  const expDate = new Date(expirationDate);
  const now = new Date();
  const daysUntilExpiry = (expDate.getTime() - now.getTime()) / (1000 * 3600 * 24);
  return daysUntilExpiry <= 30;
};