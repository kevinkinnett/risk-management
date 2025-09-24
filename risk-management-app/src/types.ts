export enum Severity {
  Low = 'low',
  Medium = 'medium',
  High = 'high',
}

export enum Probability {
  Low = 'low',
  Medium = 'medium',
  High = 'high',
}

export enum RemediationStatus {
  NotStarted = 'not_started',
  InProgress = 'in_progress',
  Completed = 'completed',
}

export enum Velocity {
  Slow = 'slow',
  Moderate = 'moderate',
  Fast = 'fast',
  Immediate = 'immediate',
}

export enum Detectability {
  Easy = 'easy',
  Moderate = 'moderate',
  Difficult = 'difficult',
}

export enum Season {
  Winter = 'winter',
  Spring = 'spring',
  Summer = 'summer',
  Fall = 'fall',
  YearRound = 'year_round',
}

export interface Category {
  id: string;
  name: string;
  description: string;
  color: string; // hex color for UI theming
}

export enum ContactCategory {
  Family = 'family',
  EmergencyServices = 'emergency_services',
  Medical = 'medical',
  Financial = 'financial',
  Legal = 'legal',
  Insurance = 'insurance',
  Utilities = 'utilities',
  Other = 'other',
}

export enum ContactPriority {
  Primary = 'primary',
  Secondary = 'secondary',
  Tertiary = 'tertiary',
}

export interface EmergencyContact {
  id: string;
  name: string;
  relationship: string; // e.g., "Spouse", "Parent", "Doctor", "Fire Department"
  category: ContactCategory;
  priority: ContactPriority;
  phonePrimary: string;
  phoneSecondary?: string;
  email?: string;
  address?: string;
  notes?: string;
  isActive: boolean;
  lastUpdated: string; // ISO date string
}

export interface Scenario {
  id: string;
  name: string;
  description: string;
  severity: Severity;
  probability: Probability;
  velocity: Velocity;
  detectability: Detectability;
  seasonalRisk?: Season[]; // seasons when this risk is more likely
  categories: string[]; // array of category ids (many-to-many)
  plans?: string[]; // array of plan ids
}

export interface Remediation {
  id: string;
  name: string;
  description: string;
  applicableScenarios: string[]; // array of scenario ids
  status: RemediationStatus;
  requiredInventory?: string[]; // array of inventory item ids
  estimatedTime?: string; // e.g., "2 hours", "1 day"
  dueDate?: string; // ISO date string
}

export interface Step {
  id: string;
  planId: string; // which plan this step belongs to
  name: string;
  description: string;
  order: number; // execution order within the plan
  status: RemediationStatus; // reuse the same status enum
  remediations: string[]; // array of remediation ids
  estimatedTime?: string; // e.g., "30 minutes", "2 hours"
  dueDate?: string; // ISO date string
  dependencies?: string[]; // array of step ids this step depends on
}

export interface Plan {
  id: string;
  name: string;
  description: string;
  scenarioId: string; // which scenario this plan belongs to
  order: number; // execution order/priority (1 = first, 2 = second, etc.)
  triggerCondition: string; // when this plan becomes active
  steps: string[]; // array of step ids
  dueDate?: string; // ISO date string
}

export interface InventoryItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  category: string;
  location: string;
  expirationDate?: string; // ISO date string, optional for non-perishable
  supplier: string;
  unitCost: number;
  minimumStock: number;
  lastUpdated: string; // ISO date string
}