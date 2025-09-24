import { Severity, Probability, RemediationStatus, ContactCategory, ContactPriority } from '../types';

export const getSeverityColor = (severity: Severity): 'success' | 'warning' | 'error' | 'default' => {
  switch (severity) {
    case Severity.Low: return 'success';
    case Severity.Medium: return 'warning';
    case Severity.High: return 'error';
    default: return 'default';
  }
};

export const getProbabilityColor = (probability: Probability): 'info' | 'warning' | 'error' | 'default' => {
  switch (probability) {
    case Probability.Low: return 'info';
    case Probability.Medium: return 'warning';
    case Probability.High: return 'error';
    default: return 'default';
  }
};

export const getStatusColor = (status: RemediationStatus): 'success' | 'warning' | 'error' | 'default' => {
  switch (status) {
    case RemediationStatus.Completed: return 'success';
    case RemediationStatus.InProgress: return 'warning';
    case RemediationStatus.NotStarted: return 'error';
    default: return 'default';
  }
};

export const getContactCategoryColor = (category: ContactCategory): 'error' | 'success' | 'primary' | 'warning' | 'info' | 'secondary' | 'default' => {
  switch (category) {
    case ContactCategory.EmergencyServices: return 'error';
    case ContactCategory.Medical: return 'success';
    case ContactCategory.Family: return 'primary';
    case ContactCategory.Financial: return 'warning';
    case ContactCategory.Insurance: return 'info';
    case ContactCategory.Utilities: return 'secondary';
    case ContactCategory.Legal: return 'default';
    default: return 'default';
  }
};

export const getContactPriorityColor = (priority: ContactPriority): 'error' | 'warning' | 'info' | 'default' => {
  switch (priority) {
    case ContactPriority.Primary: return 'error';
    case ContactPriority.Secondary: return 'warning';
    case ContactPriority.Tertiary: return 'info';
    default: return 'default';
  }
};

export const getCategoryHexColor = (category: ContactCategory): string => {
  switch (category) {
    case ContactCategory.EmergencyServices: return 'red';
    case ContactCategory.Medical: return 'green';
    case ContactCategory.Family: return 'blue';
    case ContactCategory.Financial: return 'orange';
    case ContactCategory.Insurance: return 'lightblue';
    case ContactCategory.Utilities: return 'purple';
    case ContactCategory.Legal: return 'grey';
    default: return 'grey';
  }
};