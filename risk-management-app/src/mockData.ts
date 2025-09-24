import { Scenario, Remediation, InventoryItem, Severity, Probability, RemediationStatus, Velocity, Detectability, Season, Category, Plan, Step, EmergencyContact, ContactCategory, ContactPriority } from './types';

export const mockCategories: Category[] = [
  {
    id: 'cat1',
    name: 'Natural Disasters',
    description: 'Weather-related and geological events',
    color: '#4caf50',
  },
  {
    id: 'cat2',
    name: 'Infrastructure',
    description: 'Power, utilities, and essential services',
    color: '#2196f3',
  },
  {
    id: 'cat3',
    name: 'Financial',
    description: 'Money, banking, and economic risks',
    color: '#ff9800',
  },
  {
    id: 'cat4',
    name: 'Health & Safety',
    description: 'Personal health and safety concerns',
    color: '#f44336',
  },
  {
    id: 'cat5',
    name: 'Digital Security',
    description: 'Cyber threats and data protection',
    color: '#9c27b0',
  },
  {
    id: 'cat6',
    name: 'Personal Impact',
    description: 'Life changes and personal circumstances',
    color: '#795548',
  },
];

export const mockScenarios: Scenario[] = [
  {
    id: '1',
    name: 'Power Outage',
    description: 'Extended loss of electrical power due to storm, grid failure, or other causes.',
    severity: Severity.Medium,
    probability: Probability.Medium,
    velocity: Velocity.Moderate,
    detectability: Detectability.Easy,
    seasonalRisk: [Season.Summer, Season.Winter, Season.Fall],
    categories: ['cat1', 'cat2'], // Natural Disasters, Infrastructure
    plans: ['1', '2', '3', '4', '5'], // All power outage plans
  },
  {
    id: '2',
    name: 'Natural Disaster',
    description: 'Events like hurricanes, earthquakes, floods, or wildfires affecting the area.',
    severity: Severity.High,
    probability: Probability.Low,
    velocity: Velocity.Fast,
    detectability: Detectability.Moderate,
    seasonalRisk: [Season.Summer, Season.Fall, Season.YearRound], // Hurricanes in summer/fall, earthquakes year-round
    categories: ['cat1'], // Natural Disasters
  },
  {
    id: '3',
    name: 'Bank Shutdown',
    description: 'Banks or financial institutions temporarily close, limiting access to funds.',
    severity: Severity.Medium,
    probability: Probability.Low,
    velocity: Velocity.Moderate,
    detectability: Detectability.Easy,
    seasonalRisk: [Season.YearRound],
    categories: ['cat3'], // Financial
    plans: ['6'], // Bank Shutdown Response
  },
  {
    id: '4',
    name: 'Job Loss',
    description: 'Unexpected loss of employment, affecting income and financial stability.',
    severity: Severity.High,
    probability: Probability.Medium,
    velocity: Velocity.Slow,
    detectability: Detectability.Easy,
    seasonalRisk: [Season.YearRound], // Economic factors, but higher in winter
    categories: ['cat3', 'cat6'], // Financial, Personal Impact
  },
  {
    id: '5',
    name: 'Cyber Attack',
    description: 'Hacking or malware affecting personal or financial data.',
    severity: Severity.High,
    probability: Probability.Low,
    velocity: Velocity.Fast,
    detectability: Detectability.Difficult,
    seasonalRisk: [Season.YearRound],
    categories: ['cat5'], // Digital Security
    plans: ['8'], // Cyber Attack Response
  },
  {
    id: '6',
    name: 'Pandemic',
    description: 'Widespread disease outbreak requiring quarantine and social distancing.',
    severity: Severity.High,
    probability: Probability.Low,
    velocity: Velocity.Moderate,
    detectability: Detectability.Moderate,
    seasonalRisk: [Season.Fall, Season.Winter, Season.Spring], // Flu season, various outbreaks
    categories: ['cat4'], // Health & Safety
  },
  {
    id: '7',
    name: 'Data Backup Failure',
    description: 'Loss of important digital data due to hardware failure or accidental deletion.',
    severity: Severity.Medium,
    probability: Probability.Medium,
    velocity: Velocity.Immediate,
    detectability: Detectability.Easy,
    seasonalRisk: [Season.YearRound],
    categories: ['cat5'], // Digital Security
  },
];

export const mockRemediations: Remediation[] = [
  {
    id: '1',
    name: 'Stock Emergency Supplies',
    description: 'Maintain a supply of non-perishable food, water, and essential items for at least 2 weeks.',
    applicableScenarios: ['1', '2', '6'], // power outage, natural disaster, pandemic
    status: RemediationStatus.InProgress,
    requiredInventory: ['1', '2', '3', '4', '5'], // canned food, bottled water, first aid kit, flashlights, batteries
    estimatedTime: '4 hours',
    dueDate: '2025-06-01', // Complete by summer
  },
  {
    id: '2',
    name: 'Keep Cash on Hand',
    description: 'Maintain a reasonable amount of physical cash for emergencies.',
    applicableScenarios: ['1', '3'], // power outage, bank shutdown
    status: RemediationStatus.Completed,
    requiredInventory: ['6'], // cash
  },
  {
    id: '3',
    name: 'Emergency Fund',
    description: 'Build and maintain an emergency savings fund covering 3-6 months of expenses.',
    applicableScenarios: ['4'], // job loss
    status: RemediationStatus.NotStarted,
    estimatedTime: '3 months',
    dueDate: '2025-12-31', // Build fund by end of year
  },
  {
    id: '4',
    name: 'Cybersecurity Measures',
    description: 'Use strong passwords, enable 2FA, and keep software updated.',
    applicableScenarios: ['5'], // cyber attack
    status: RemediationStatus.Completed,
  },
  {
    id: '5',
    name: 'Regular Data Backups',
    description: 'Perform regular backups of important data to external drives or cloud services.',
    applicableScenarios: ['7'], // data backup failure
    status: RemediationStatus.InProgress,
  },
  {
    id: '6',
    name: 'Home Generator',
    description: 'Install a backup generator for essential power needs.',
    applicableScenarios: ['1'], // power outage
    status: RemediationStatus.NotStarted,
    requiredInventory: ['7'], // generator fuel
  },
];

export const mockSteps: Step[] = [
  // Power Outage Plan 1 - Immediate Response
  {
    id: 's1',
    planId: '1',
    name: 'Assess the situation',
    description: 'Check power status, determine scope and likely duration',
    order: 1,
    status: RemediationStatus.Completed,
    remediations: [],
    estimatedTime: '5 minutes',
  },
  {
    id: 's2',
    planId: '1',
    name: 'Secure immediate cash access',
    description: 'Ensure access to physical cash for essential purchases',
    order: 2,
    status: RemediationStatus.Completed,
    remediations: ['2'],
    estimatedTime: '10 minutes',
  },

  // Power Outage Plan 2 - Short-term
  {
    id: 's3',
    planId: '2',
    name: 'Activate emergency supplies',
    description: 'Locate and prepare emergency food, water, and supplies',
    order: 1,
    status: RemediationStatus.InProgress,
    remediations: ['1'],
    estimatedTime: '30 minutes',
  },
  {
    id: 's4',
    planId: '2',
    name: 'Check generator readiness',
    description: 'Verify generator is ready and fuel is available',
    order: 2,
    status: RemediationStatus.NotStarted,
    remediations: ['6'],
    estimatedTime: '15 minutes',
  },

  // Power Outage Plan 3 - Extended
  {
    id: 's5',
    planId: '3',
    name: 'Start generator',
    description: 'Set up and start backup generator for essential power',
    order: 1,
    status: RemediationStatus.NotStarted,
    remediations: ['6'],
    estimatedTime: '20 minutes',
  },
  {
    id: 's6',
    planId: '3',
    name: 'Monitor fuel levels',
    description: 'Track generator fuel consumption and plan refueling',
    order: 2,
    status: RemediationStatus.NotStarted,
    remediations: [],
    estimatedTime: 'Ongoing',
  },

  // Bank Shutdown Plan
  {
    id: 's7',
    planId: '6',
    name: 'Verify cash reserves',
    description: 'Confirm sufficient physical cash is available',
    order: 1,
    status: RemediationStatus.Completed,
    remediations: ['2'],
    estimatedTime: '5 minutes',
  },

  // Job Loss Plan
  {
    id: 's8',
    planId: '7',
    name: 'Access emergency fund',
    description: 'Review and prepare to access emergency savings',
    order: 1,
    status: RemediationStatus.NotStarted,
    remediations: ['3'],
    estimatedTime: '30 minutes',
    dueDate: '2025-01-15', // Quick action needed
  },

  // Cyber Attack Plan
  {
    id: 's9',
    planId: '8',
    name: 'Execute security protocols',
    description: 'Follow established cybersecurity response procedures',
    order: 1,
    status: RemediationStatus.Completed,
    remediations: ['4'],
    estimatedTime: '15 minutes',
  },
];

export const mockEmergencyContacts: EmergencyContact[] = [
  // Emergency Services
  {
    id: 'ec1',
    name: 'Local Police Department',
    relationship: 'Emergency Services',
    category: ContactCategory.EmergencyServices,
    priority: ContactPriority.Primary,
    phonePrimary: '911',
    phoneSecondary: '(555) 123-4567',
    address: '123 Main St, Anytown, USA',
    notes: 'Non-emergency line available 24/7',
    isActive: true,
    lastUpdated: '2024-09-24T10:00:00Z',
  },
  {
    id: 'ec2',
    name: 'Fire Department',
    relationship: 'Emergency Services',
    category: ContactCategory.EmergencyServices,
    priority: ContactPriority.Primary,
    phonePrimary: '911',
    phoneSecondary: '(555) 987-6543',
    address: '456 Fire Station Rd, Anytown, USA',
    notes: 'Handles fire emergencies and medical calls',
    isActive: true,
    lastUpdated: '2024-09-24T10:00:00Z',
  },
  {
    id: 'ec3',
    name: 'Local Hospital - Emergency Room',
    relationship: 'Emergency Medical Services',
    category: ContactCategory.Medical,
    priority: ContactPriority.Primary,
    phonePrimary: '(555) 555-1234',
    address: '789 Hospital Way, Anytown, USA',
    notes: '24/7 emergency room services',
    isActive: true,
    lastUpdated: '2024-09-24T10:00:00Z',
  },

  // Family Contacts
  {
    id: 'ec4',
    name: 'John Smith',
    relationship: 'Spouse',
    category: ContactCategory.Family,
    priority: ContactPriority.Primary,
    phonePrimary: '(555) 111-2222',
    phoneSecondary: '(555) 111-3333',
    email: 'john.smith@email.com',
    address: '123 Family St, Anytown, USA',
    notes: 'Emergency contact and next of kin',
    isActive: true,
    lastUpdated: '2024-09-24T10:00:00Z',
  },
  {
    id: 'ec5',
    name: 'Jane Smith',
    relationship: 'Sister',
    category: ContactCategory.Family,
    priority: ContactPriority.Secondary,
    phonePrimary: '(555) 444-5555',
    email: 'jane.smith@email.com',
    address: '456 Sister Ave, Nearby City, USA',
    notes: 'Lives 30 minutes away, can provide emergency support',
    isActive: true,
    lastUpdated: '2024-09-24T10:00:00Z',
  },

  // Medical Contacts
  {
    id: 'ec6',
    name: 'Dr. Sarah Johnson',
    relationship: 'Primary Care Physician',
    category: ContactCategory.Medical,
    priority: ContactPriority.Primary,
    phonePrimary: '(555) 666-7777',
    email: 'dr.johnson@medicalcenter.com',
    address: '321 Medical Center Dr, Anytown, USA',
    notes: 'Family doctor, available Mon-Fri 9am-5pm',
    isActive: true,
    lastUpdated: '2024-09-24T10:00:00Z',
  },
  {
    id: 'ec7',
    name: 'Dr. Michael Chen',
    relationship: 'Dentist',
    category: ContactCategory.Medical,
    priority: ContactPriority.Secondary,
    phonePrimary: '(555) 888-9999',
    email: 'dr.chen@dentalcare.com',
    address: '654 Dental Plaza, Anytown, USA',
    notes: 'Emergency dental care available',
    isActive: true,
    lastUpdated: '2024-09-24T10:00:00Z',
  },

  // Financial Contacts
  {
    id: 'ec8',
    name: 'Anytown Bank',
    relationship: 'Primary Bank',
    category: ContactCategory.Financial,
    priority: ContactPriority.Primary,
    phonePrimary: '(555) 000-1111',
    phoneSecondary: '(555) 000-2222',
    email: 'support@anytownbank.com',
    address: '987 Bank Street, Anytown, USA',
    notes: '24/7 customer service, emergency card replacement',
    isActive: true,
    lastUpdated: '2024-09-24T10:00:00Z',
  },

  // Insurance Contacts
  {
    id: 'ec9',
    name: 'SafeGuard Insurance',
    relationship: 'Home Insurance Provider',
    category: ContactCategory.Insurance,
    priority: ContactPriority.Primary,
    phonePrimary: '(800) 123-4567',
    email: 'claims@safe-guard.com',
    address: '159 Insurance Blvd, Insurance City, USA',
    notes: '24/7 claims hotline for emergency situations',
    isActive: true,
    lastUpdated: '2024-09-24T10:00:00Z',
  },

  // Utility Contacts
  {
    id: 'ec10',
    name: 'Power Utility Company',
    relationship: 'Electricity Provider',
    category: ContactCategory.Utilities,
    priority: ContactPriority.Primary,
    phonePrimary: '(555) 333-4444',
    phoneSecondary: '(555) 333-5555',
    email: 'emergency@powerutility.com',
    address: '753 Utility Road, Power City, USA',
    notes: 'Emergency power outage reporting and restoration',
    isActive: true,
    lastUpdated: '2024-09-24T10:00:00Z',
  },
];

export const mockPlans: Plan[] = [
  {
    id: '1',
    name: 'Immediate Response - Power Outage',
    description: 'Actions to take as soon as power goes out.',
    scenarioId: '1', // Power Outage
    order: 1,
    triggerCondition: 'Power outage detected',
    steps: ['s1', 's2'], // Assess situation, Secure cash access
  },
  {
    id: '2',
    name: 'Short-term Power Outage (Hours)',
    description: 'Plan for outages lasting several hours.',
    scenarioId: '1', // Power Outage
    order: 2,
    triggerCondition: 'Power out for more than 1 hour',
    steps: ['s3', 's4'], // Activate supplies, Check generator
  },
  {
    id: '3',
    name: 'Extended Power Outage (Days)',
    description: 'Plan for prolonged power outages requiring backup power.',
    scenarioId: '1', // Power Outage
    order: 3,
    triggerCondition: 'Power out for more than 24 hours',
    steps: ['s5', 's6'], // Start generator, Monitor fuel
  },
  {
    id: '4',
    name: 'Generator Failure - What If',
    description: 'What to do if the backup generator fails or runs out of fuel.',
    scenarioId: '1', // Power Outage
    order: 4,
    triggerCondition: 'Generator fails or fuel runs out',
    steps: ['s3'], // Activate emergency supplies (fallback)
  },
  {
    id: '5',
    name: 'Data Backup Failure - What If',
    description: 'What to do if local data storage fails during power outage.',
    scenarioId: '1', // Power Outage
    order: 5,
    triggerCondition: 'Local NAS or storage fails',
    steps: [], // Would need data recovery steps
  },
  {
    id: '6',
    name: 'Bank Shutdown Response',
    description: 'Immediate actions when banks close unexpectedly.',
    scenarioId: '3', // Bank Shutdown
    order: 1,
    triggerCondition: 'Banks announce closure',
    steps: ['s7'], // Verify cash reserves
  },
  {
    id: '7',
    name: 'Job Loss Immediate Response',
    description: 'First steps to take when employment is lost.',
    scenarioId: '4', // Job Loss
    order: 1,
    triggerCondition: 'Job loss confirmed',
    steps: ['s8'], // Access emergency fund
    dueDate: '2025-01-15', // Immediate action needed
  },
  {
    id: '8',
    name: 'Cyber Attack Response',
    description: 'Immediate actions to take when cyber attack is detected.',
    scenarioId: '5', // Cyber Attack
    order: 1,
    triggerCondition: 'Cyber attack detected',
    steps: ['s9'], // Execute security protocols
  },
];

export const mockInventory: InventoryItem[] = [
  {
    id: '1',
    name: 'Canned Food',
    description: 'Non-perishable canned goods like vegetables, soups, and meats.',
    quantity: 50,
    category: 'Food',
    location: 'Pantry Shelf A',
    expirationDate: '2026-12-31',
    supplier: 'Local Grocery Store',
    unitCost: 2.50,
    minimumStock: 20,
    lastUpdated: '2024-09-24T10:00:00Z',
  },
  {
    id: '2',
    name: 'Bottled Water',
    description: 'Clean drinking water in plastic bottles.',
    quantity: 100,
    category: 'Water',
    location: 'Garage Storage',
    supplier: 'Bulk Water Supplier',
    unitCost: 0.50,
    minimumStock: 50,
    lastUpdated: '2024-09-24T10:00:00Z',
  },
  {
    id: '3',
    name: 'First Aid Kit',
    description: 'Medical supplies including bandages, antiseptics, and medications.',
    quantity: 1,
    category: 'Medical',
    location: 'Bathroom Cabinet',
    expirationDate: '2025-06-30',
    supplier: 'Medical Supply Co.',
    unitCost: 25.00,
    minimumStock: 1,
    lastUpdated: '2024-09-24T10:00:00Z',
  },
  {
    id: '4',
    name: 'Flashlights',
    description: 'Battery-powered or rechargeable flashlights.',
    quantity: 5,
    category: 'Tools',
    location: 'Emergency Kit',
    supplier: 'Hardware Store',
    unitCost: 15.00,
    minimumStock: 2,
    lastUpdated: '2024-09-24T10:00:00Z',
  },
  {
    id: '5',
    name: 'Batteries',
    description: 'Various sizes of batteries for devices.',
    quantity: 20,
    category: 'Tools',
    location: 'Utility Drawer',
    supplier: 'Electronics Store',
    unitCost: 5.00,
    minimumStock: 10,
    lastUpdated: '2024-09-24T10:00:00Z',
  },
  {
    id: '6',
    name: 'Cash',
    description: 'Physical currency in small denominations.',
    quantity: 500, // amount in dollars
    category: 'Finance',
    location: 'Safe',
    supplier: 'Bank',
    unitCost: 1.00,
    minimumStock: 100,
    lastUpdated: '2024-09-24T10:00:00Z',
  },
  {
    id: '7',
    name: 'Generator Fuel',
    description: 'Stabilized gasoline for emergency generator.',
    quantity: 10, // gallons
    category: 'Fuel',
    location: 'Garage',
    expirationDate: '2025-03-31',
    supplier: 'Fuel Station',
    unitCost: 4.00,
    minimumStock: 5,
    lastUpdated: '2024-09-24T10:00:00Z',
  },
  {
    id: '8',
    name: 'Blankets',
    description: 'Thermal blankets for emergency warmth.',
    quantity: 12,
    category: 'Clothing',
    location: 'Closet',
    supplier: 'Department Store',
    unitCost: 8.00,
    minimumStock: 6,
    lastUpdated: '2024-09-24T10:00:00Z',
  },
];