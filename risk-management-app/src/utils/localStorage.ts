// Local storage utilities for persisting app state

const STORAGE_KEYS = {
  DARK_MODE: 'risk-management-dark-mode',
  CURRENT_PAGE: 'risk-management-current-page',
  DASHBOARD_SORT_BY: 'risk-management-dashboard-sort-by',
  DASHBOARD_SORT_ORDER: 'risk-management-dashboard-sort-order',
} as const;

// Dark mode storage
export const getStoredDarkMode = (): boolean => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.DARK_MODE);
    return stored ? JSON.parse(stored) : false;
  } catch {
    return false;
  }
};

export const setStoredDarkMode = (darkMode: boolean): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.DARK_MODE, JSON.stringify(darkMode));
  } catch {
    // Ignore localStorage errors
  }
};

// Current page storage
export const getStoredCurrentPage = (): string => {
  try {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_PAGE) || '/';
  } catch {
    return '/';
  }
};

export const setStoredCurrentPage = (page: string): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.CURRENT_PAGE, page);
  } catch {
    // Ignore localStorage errors
  }
};

// Dashboard sort preferences
export const getStoredDashboardSortBy = (): 'probability' | 'preparedness' | 'severity' | 'name' => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.DASHBOARD_SORT_BY);
    if (stored && ['probability', 'preparedness', 'severity', 'name'].includes(stored)) {
      return stored as 'probability' | 'preparedness' | 'severity' | 'name';
    }
  } catch {
    // Ignore localStorage errors
  }
  return 'probability'; // default
};

export const setStoredDashboardSortBy = (sortBy: 'probability' | 'preparedness' | 'severity' | 'name'): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.DASHBOARD_SORT_BY, sortBy);
  } catch {
    // Ignore localStorage errors
  }
};

export const getStoredDashboardSortOrder = (): 'asc' | 'desc' => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.DASHBOARD_SORT_ORDER);
    if (stored === 'asc' || stored === 'desc') {
      return stored;
    }
  } catch {
    // Ignore localStorage errors
  }
  return 'desc'; // default
};

export const setStoredDashboardSortOrder = (sortOrder: 'asc' | 'desc'): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.DASHBOARD_SORT_ORDER, sortOrder);
  } catch {
    // Ignore localStorage errors
  }
};