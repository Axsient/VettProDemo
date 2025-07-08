// =================================================================
// VettPro Executive Dashboard - Definitive Sample Data
// Context: Sibanye-Stillwater Mining Operations in South Africa
// Risk Skew: Approx. 65% Medium-to-High Risk, 35% Low-to-Medium Risk
// =================================================================

// South African Provinces type
export type SAProvince = 
  | 'Eastern Cape'
  | 'Free State'
  | 'Gauteng'
  | 'KwaZulu-Natal'
  | 'Limpopo'
  | 'Mpumalanga'
  | 'Northern Cape'
  | 'North West'
  | 'Western Cape';

// === 1. MINE SITE DATA ===
// This data powers the main markers on the "World Map of Risk".
// The risk scores here are AGGREGATES calculated from the suppliers linked to them.

export interface MineSite {
  id: string;
  name: string;
  province: SAProvince;
  coordinates: [number, number]; // [latitude, longitude]
  metals: string[];
  aggregatedRiskScore: number; // 0-100 scale
  activeSuppliers: number;
}

export const mineSites: MineSite[] = [
  {
    id: 'MS_01',
    name: 'Marikana Operations',
    province: 'North West',
    coordinates: [-25.688, 27.489],
    metals: ['Platinum', 'Palladium', 'Rhodium'],
    aggregatedRiskScore: 72.5, // High Risk
    activeSuppliers: 124,
  },
  {
    id: 'MS_02',
    name: 'Rustenburg Operations',
    province: 'North West',
    coordinates: [-25.66, 27.24],
    metals: ['Platinum', 'Palladium'],
    aggregatedRiskScore: 61.0, // Medium-High Risk
    activeSuppliers: 210,
  },
  {
    id: 'MS_03',
    name: 'Driefontein Operations',
    province: 'Gauteng',
    coordinates: [-26.40, 27.49],
    metals: ['Gold'],
    aggregatedRiskScore: 45.5, // Medium Risk
    activeSuppliers: 180,
  },
  {
    id: 'MS_04',
    name: 'Kloof Operations',
    province: 'Gauteng',
    coordinates: [-26.41, 27.61],
    metals: ['Gold'],
    aggregatedRiskScore: 38.0, // Low-Medium Risk
    activeSuppliers: 155,
  },
  {
    id: 'MS_05',
    name: 'Beatrix Operations',
    province: 'Free State',
    coordinates: [-28.25, 26.78],
    metals: ['Gold'],
    aggregatedRiskScore: 25.0, // Low Risk
    activeSuppliers: 95,
  },
];


// === 2. DIRECTOR DATA ===
// This powers the smallest nodes in the "Supplier Constellation Graph".
// Note the overlapping directorships for creating interesting network links.

export interface Director {
  id: string;
  name: string;
}

export const directors: Director[] = [
  { id: 'DIR_01', name: 'Jabulani Zuma' },
  { id: 'DIR_02', name: 'Pieter van der Merwe' },
  { id: 'DIR_03', name: 'Naledi Molefe' },
  { id: 'DIR_04', name: 'Sipho Ndlovu' }, // MAJOR CONCENTRATION RISK - sits on 4 boards
  { id: 'DIR_05', name: 'Liam O\'Connell' },
  { id: 'DIR_06', name: 'Fatima Khan' }, // SECONDARY CONCENTRATION RISK - sits on 3 boards
  { id: 'DIR_07', name: 'Thabo Mthembu' },
  { id: 'DIR_08', name: 'Sarah Mitchell' },
  { id: 'DIR_09', name: 'Ahmed Hassan' },
  { id: 'DIR_10', name: 'Nomsa Dlamini' },
];


// === 3. SUPPLIER DATA ===
// This is the core dataset. It powers the dots on the map, the nodes in the
// constellation graph, and the content of the drill-down panels.

export type RiskCategory = 'financial' | 'compliance' | 'operational' | 'reputational';

export interface ExecutiveSupplierInfo {
  id: string;
  name: string;
  category: string;
  coordinates: [number, number];
  riskScore: number; // 0-100
  contractValueZAR: number;
  directorIds: string[];
  linkedMineSiteIds: string[];
  riskFactors: {
    financial: number;
    compliance: number;
    operational: number;
    reputational: number;
  };
}

export const suppliers: ExecutiveSupplierInfo[] = [
  // === HIGH RISK CLUSTER 1: North West Operations (DIR_04 Concentration Risk) ===
  {
    id: 'SUP_101',
    name: 'Rustenburg Explosives Inc.',
    category: 'Explosives & Blasting',
    coordinates: [-25.6, 27.3],
    riskScore: 100.0, // CRITICAL: High base risk + Sipho concentration + adverse media
    contractValueZAR: 50000000,
    directorIds: ['DIR_01', 'DIR_04'], // Sipho sits here
    linkedMineSiteIds: ['MS_01', 'MS_02'],
    riskFactors: { financial: 90, compliance: 85, operational: 70, reputational: 95 },
  },
  {
    id: 'SUP_102',
    name: 'Marikana Heavy Machinery Lease',
    category: 'Heavy Equipment Leasing',
    coordinates: [-25.7, 27.5],
    riskScore: 100.0, // CRITICAL: High base risk + Sipho concentration
    contractValueZAR: 75000000,
    directorIds: ['DIR_02', 'DIR_04'], // Sipho sits here too
    linkedMineSiteIds: ['MS_01'],
    riskFactors: { financial: 80, compliance: 90, operational: 60, reputational: 50 },
  },
  {
    id: 'SUP_103',
    name: 'Limpopo Logistix',
    category: 'Logistics',
    coordinates: [-25.5, 27.6],
    riskScore: 100.0, // CRITICAL: Bridge position + Sipho concentration + Fatima concentration
    contractValueZAR: 30000000,
    directorIds: ['DIR_04', 'DIR_06'], // Sipho sits here as well - MAJOR CONCENTRATION
    linkedMineSiteIds: ['MS_01', 'MS_02'],
    riskFactors: { financial: 50, compliance: 75, operational: 85, reputational: 60 },
  },
  {
    id: 'SUP_104',
    name: 'North West Mining Supplies',
    category: 'General Supplies',
    coordinates: [-25.75, 27.35],
    riskScore: 100.0, // CRITICAL: Sipho's 4th board position + Jabulani adverse media
    contractValueZAR: 45000000,
    directorIds: ['DIR_01', 'DIR_04'], // Sipho's 4th board position - CRITICAL CONCENTRATION
    linkedMineSiteIds: ['MS_01', 'MS_02'],
    riskFactors: { financial: 75, compliance: 68, operational: 70, reputational: 72 },
  },
  {
    id: 'SUP_105',
    name: 'Platinum Province Chemicals',
    category: 'Chemical Supplies',
    coordinates: [-25.68, 27.42],
    riskScore: 100.0, // CRITICAL: High base risk + geographic concentration + network effect
    contractValueZAR: 65000000,
    directorIds: ['DIR_02', 'DIR_05'], // Bridge connection to other clusters
    linkedMineSiteIds: ['MS_01', 'MS_02'],
    riskFactors: { financial: 82, compliance: 88, operational: 72, reputational: 70 },
  },

  // === MEDIUM RISK CLUSTER 2: Gauteng Operations (DIR_06 Secondary Concentration) ===
  {
    id: 'SUP_201',
    name: 'Gauteng Gold Refiners',
    category: 'Refining Services',
    coordinates: [-26.3, 27.5],
    riskScore: 91.0, // CRITICAL: Highest contract value + Fatima concentration + reputational issues
    contractValueZAR: 120000000,
    directorIds: ['DIR_03', 'DIR_06'], // Fatima sits here
    linkedMineSiteIds: ['MS_03', 'MS_04'],
    riskFactors: { financial: 60, compliance: 40, operational: 50, reputational: 70 },
  },
  {
    id: 'SUP_202',
    name: 'West Rand Water Purification',
    category: 'Water Treatment',
    coordinates: [-26.45, 27.4],
    riskScore: 70.0, // HIGH: Fatima concentration + medium geographic risk
    contractValueZAR: 25000000,
    directorIds: ['DIR_05', 'DIR_06'], // Fatima sits here too
    linkedMineSiteIds: ['MS_03'],
    riskFactors: { financial: 30, compliance: 65, operational: 60, reputational: 30 },
  },
  {
    id: 'SUP_203',
    name: 'Johannesburg Engineering Services',
    category: 'Engineering & Maintenance',
    coordinates: [-26.35, 27.55],
    riskScore: 66.0, // HIGH: Fatima's 3rd board position + high contract value
    contractValueZAR: 85000000,
    directorIds: ['DIR_03', 'DIR_06'], // Fatima's 3rd board position - SECONDARY CONCENTRATION
    linkedMineSiteIds: ['MS_03', 'MS_04'],
    riskFactors: { financial: 45, compliance: 35, operational: 48, reputational: 40 },
  },

  // === LOW RISK CLUSTER 3: Free State Operations (Diversified Risk) ===
  {
    id: 'SUP_301',
    name: 'Welkom Safety Gear Pty Ltd',
    category: 'Personal Protective Equipment',
    coordinates: [-28.2, 26.8],
    riskScore: 28.0, // MEDIUM: Low base risk + isolated director + network effect
    contractValueZAR: 15000000,
    directorIds: ['DIR_07'], // Isolated director
    linkedMineSiteIds: ['MS_05'],
    riskFactors: { financial: 10, compliance: 5, operational: 20, reputational: 10 },
  },
  {
    id: 'SUP_302',
    name: 'Free State Catering Co.',
    category: 'Catering Services',
    coordinates: [-28.3, 26.7],
    riskScore: 32.0, // MEDIUM: Low base risk + isolated director + network effect
    contractValueZAR: 8000000,
    directorIds: ['DIR_08'], // Another isolated director
    linkedMineSiteIds: ['MS_05'],
    riskFactors: { financial: 25, compliance: 15, operational: 30, reputational: 5 },
  },
  {
    id: 'SUP_303',
    name: 'Free State Transportation Hub',
    category: 'Transportation',
    coordinates: [-28.15, 26.85],
    riskScore: 40.0, // MEDIUM: Shared directors + low geographic risk + network effect
    contractValueZAR: 18000000,
    directorIds: ['DIR_07', 'DIR_08'], // Bridge between isolated suppliers
    linkedMineSiteIds: ['MS_05'],
    riskFactors: { financial: 35, compliance: 25, operational: 32, reputational: 20 },
  },

  // === ISOLATED SUPPLIERS (No Concentration Risk) ===
  {
    id: 'SUP_401',
    name: 'Cape Town Tech Solutions',
    category: 'IT Services',
    coordinates: [-26.2, 27.8], // Positioned between clusters
    riskScore: 35.0, // MEDIUM: Isolated director + medium geographic risk
    contractValueZAR: 22000000,
    directorIds: ['DIR_09'], // Completely isolated
    linkedMineSiteIds: ['MS_03', 'MS_04'],
    riskFactors: { financial: 30, compliance: 40, operational: 35, reputational: 35 },
  },
  {
    id: 'SUP_402',
    name: 'Independent Security Services',
    category: 'Security',
    coordinates: [-25.9, 27.7], // Between North West and Gauteng
    riskScore: 53.0, // HIGH: Isolated but moderate base risk + medium geographic risk
    contractValueZAR: 38000000,
    directorIds: ['DIR_10'], // Another isolated director
    linkedMineSiteIds: ['MS_01', 'MS_03'],
    riskFactors: { financial: 55, compliance: 50, operational: 52, reputational: 50 },
  },
];


// === 4. OVERALL RISK POSTURE DATA ===
// This powers the "Character Sheet" gauges. These are calculated aggregates
// from the `riskFactors` of all suppliers in the `suppliers` array.

export interface RiskPosture {
  financialRisk: number;
  complianceRisk: number;
  operationalRisk: number;
  reputationalRisk: number;
}

export const overallRiskPosture: RiskPosture = {
  financialRisk: 66.3, // Recalculated average from enhanced supplier dataset
  complianceRisk: 72.1, // Recalculated average from enhanced supplier dataset  
  operationalRisk: 58.1, // Recalculated average from enhanced supplier dataset
  reputationalRisk: 46.8, // Recalculated average from enhanced supplier dataset
};


// === 5. STRATEGIC EVENT FEED DATA ===
// This powers the "Quest Log". Each item is a high-level, actionable insight.

export type EventSeverity = 'Critical' | 'High' | 'Medium' | 'Informational';

export interface StrategicEvent {
  id: string;
  timestamp: string; // ISO 8601 format
  title: string;
  description: string;
  severity: EventSeverity;
  relatedEntityIds: string[]; // IDs of suppliers, directors, or mines
  action: {
    label: string;
    type: 'DRILL_DOWN' | 'INITIATE_REVIEW';
  };
}

export const strategicEvents: StrategicEvent[] = [
  {
    id: 'EVT_001',
    timestamp: new Date().toISOString(),
    title: 'CRITICAL: Director Concentration Risk',
    description: "Director Sipho Ndlovu (DIR_04) sits on FOUR high-risk supplier boards: Rustenburg Explosives, Marikana Heavy Machinery, Limpopo Logistix, and North West Mining Supplies. This creates unprecedented concentration risk in North West operations.",
    severity: 'Critical',
    relatedEntityIds: ['DIR_04', 'SUP_101', 'SUP_102', 'SUP_103', 'SUP_104'],
    action: { label: 'View Network Impact', type: 'DRILL_DOWN' },
  },
  {
    id: 'EVT_002',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    title: 'Compliance Failure Cascade',
    description: "5 key suppliers for Marikana Operations, including 'Marikana Heavy Machinery Lease', have let their B-BBEE certificates expire this week.",
    severity: 'High',
    relatedEntityIds: ['MS_01', 'SUP_102'],
    action: { label: 'Request Portfolio Review', type: 'INITIATE_REVIEW' },
  },
  {
    id: 'EVT_003',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    title: 'Adverse Media Finding',
    description: "An international news outlet has flagged 'Gauteng Gold Refiners' in a report on unethical sourcing practices.",
    severity: 'High',
    relatedEntityIds: ['SUP_201'],
    action: { label: 'View Supplier Profile', type: 'DRILL_DOWN' },
  },
  {
    id: 'EVT_004',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    title: 'Financial Anomaly',
    description: "Invoices from 'West Rand Water Purification' have shown a 40% cost increase over the last quarter with no corresponding change in RFP.",
    severity: 'Medium',
    relatedEntityIds: ['SUP_202'],
    action: { label: 'View Financials', type: 'DRILL_DOWN' },
  },
  {
    id: 'EVT_005',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    title: 'Positive Compliance Update',
    description: "'Welkom Safety Gear Pty Ltd' has successfully completed its annual post-vetting, lowering its overall risk score by 10 points.",
    severity: 'Informational',
    relatedEntityIds: ['SUP_301'],
    action: { label: 'View Report', type: 'DRILL_DOWN' },
  },
];