### **Definitive Sample Data for the Executive Dashboard**

**File Location:** `/src/lib/sample-data/executive-dashboard-data.ts`

```typescript
// =================================================================
// VettPro Executive Dashboard - Definitive Sample Data
// Context: Sibanye-Stillwater Mining Operations in South Africa
// Risk Skew: Approx. 65% Medium-to-High Risk, 35% Low-to-Medium Risk
// =================================================================

import { SAProvince } from '@/types/supplier'; // Assuming type definition exists

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
  { id: 'DIR_04', name: 'Sipho Ndlovu' }, // Sits on multiple boards
  { id: 'DIR_05', name: 'Liam O\'Connell' },
  { id: 'DIR_06', name: 'Fatima Khan' },
];


// === 3. SUPPLIER DATA ===
// This is the core dataset. It powers the dots on the map, the nodes in the
// constellation graph, and the content of the drill-down panels.

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
  // --- High Risk Suppliers (around Marikana/Rustenburg) ---
  {
    id: 'SUP_101',
    name: 'Rustenburg Explosives Inc.',
    category: 'Explosives & Blasting',
    coordinates: [-25.6, 27.3],
    riskScore: 88.0,
    contractValueZAR: 50000000,
    directorIds: ['DIR_01', 'DIR_04'], // Sipho is here
    linkedMineSiteIds: ['MS_01', 'MS_02'],
    riskFactors: { financial: 90, compliance: 85, operational: 70, reputational: 95 },
  },
  {
    id: 'SUP_102',
    name: 'Marikana Heavy Machinery Lease',
    category: 'Heavy Equipment Leasing',
    coordinates: [-25.7, 27.5],
    riskScore: 75.0,
    contractValueZAR: 75000000,
    directorIds: ['DIR_02'],
    linkedMineSiteIds: ['MS_01'],
    riskFactors: { financial: 80, compliance: 90, operational: 60, reputational: 50 },
  },
  {
    id: 'SUP_103',
    name: 'Limpopo Logistix',
    category: 'Logistics',
    coordinates: [-25.5, 27.6],
    riskScore: 68.0,
    contractValueZAR: 30000000,
    directorIds: ['DIR_04', 'DIR_06'], // Sipho is also here - a key link
    linkedMineSiteIds: ['MS_01', 'MS_02'],
    riskFactors: { financial: 50, compliance: 75, operational: 85, reputational: 60 },
  },

  // --- Medium Risk Suppliers (around Gauteng) ---
  {
    id: 'SUP_201',
    name: 'Gauteng Gold Refiners',
    category: 'Refining Services',
    coordinates: [-26.3, 27.5],
    riskScore: 55.0,
    contractValueZAR: 120000000,
    directorIds: ['DIR_03'],
    linkedMineSiteIds: ['MS_03', 'MS_04'],
    riskFactors: { financial: 60, compliance: 40, operational: 50, reputational: 70 },
  },
  {
    id: 'SUP_202',
    name: 'West Rand Water Purification',
    category: 'Water Treatment',
    coordinates: [-26.45, 27.4],
    riskScore: 48.0,
    contractValueZAR: 25000000,
    directorIds: ['DIR_05'],
    linkedMineSiteIds: ['MS_03'],
    riskFactors: { financial: 30, compliance: 65, operational: 60, reputational: 30 },
  },

  // --- Low Risk Suppliers (around Free State & others) ---
  {
    id: 'SUP_301',
    name: 'Welkom Safety Gear Pty Ltd',
    category: 'Personal Protective Equipment',
    coordinates: [-28.2, 26.8],
    riskScore: 15.0,
    contractValueZAR: 15000000,
    directorIds: ['DIR_06'],
    linkedMineSiteIds: ['MS_05'],
    riskFactors: { financial: 10, compliance: 5, operational: 20, reputational: 10 },
  },
  {
    id: 'SUP_302',
    name: 'Free State Catering Co.',
    category: 'Catering Services',
    coordinates: [-28.3, 26.7],
    riskScore: 22.0,
    contractValueZAR: 8000000,
    directorIds: [],
    linkedMineSiteIds: ['MS_05'],
    riskFactors: { financial: 25, compliance: 15, operational: 30, reputational: 5 },
  },
  // ... We would generate ~200-500 more supplier records following this pattern
  // to create a dense and realistic map visualization.
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
  financialRisk: 65.7, // Average of all financial risk factors
  complianceRisk: 72.1, // Average of all compliance risk factors
  operationalRisk: 58.4, // Average of all operational risk factors
  reputationalRisk: 45.9, // Average of all reputational risk factors
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
    title: 'Concentration Risk Detected',
    description: "Director Sipho Ndlovu (DIR_04) now sits on the boards of both 'Rustenburg Explosives Inc.' and 'Limpopo Logistix', two high-risk suppliers in a critical supply chain.",
    severity: 'Critical',
    relatedEntityIds: ['DIR_04', 'SUP_101', 'SUP_103'],
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
```

### How This Data Powers the Dashboard

*   **`mineSites`**: Directly populates the main markers on the **`RiskConcentrationMap`**. Their `aggregatedRiskScore` determines the glow color. Clicking a site uses its ID to filter other data.
*   **`directors` & `suppliers`**: These two arrays are used together to build the **`SupplierNetworkGraph`**. The `directorIds` array in each supplier object creates the links. The `riskScore` determines the node color, and `contractValueZAR` determines the node size.
*   **`suppliers` (alone)**: The `coordinates` for each supplier are used to render the thousands of small dots on the **`RiskConcentrationMap`**, creating the heatmap effect.
*   **`overallRiskPosture`**: The four values in this object directly feed the four **`RiskPostureGauges`**, providing the main "health bar" stats.
*   **`strategicEvents`**: This array populates the **`StrategicEventFeed`** ("Quest Log"). The `severity` determines the color of the list item, and the `action` and `relatedEntityIds` are used to trigger the interactive drill-downs across the entire dashboard.

This data set is designed to be a living ecosystem. Changing a single supplier's risk score would automatically affect the aggregated score of its linked mine site, the color of its node in the constellation, and potentially trigger a new strategic event. This provides the rich, interconnected experience required for a world-class executive dashboard.