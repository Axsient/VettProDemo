/**
 * Apply Risk Scoring Engine to Executive Dashboard Sample Data
 * 
 * This script applies the comprehensive risk scoring engine to recalculate
 * all supplier and director risk scores based on proper concentration risk,
 * network effects, and operational factors.
 */

import RiskScoringEngine, { 
  SupplierRiskProfile, 
  DirectorRiskProfile, 
  DEFAULT_RISK_CONFIG 
} from './risk-scoring-engine';

// Define director profiles with proper risk factors
const DIRECTOR_PROFILES: DirectorRiskProfile[] = [
  {
    id: 'DIR_01',
    name: 'Jabulani Zuma',
    boardPositions: ['SUP_101', 'SUP_104'],
    yearsExperience: 12,
    hasAdverseMedia: true,  // Political connections, ethical concerns
    complianceHistory: 'minor'
  },
  {
    id: 'DIR_02',
    name: 'Pieter van der Merwe',
    boardPositions: ['SUP_102', 'SUP_105'],
    yearsExperience: 18,
    hasAdverseMedia: false,
    complianceHistory: 'clean'
  },
  {
    id: 'DIR_03',
    name: 'Naledi Molefe',
    boardPositions: ['SUP_201', 'SUP_203'],
    yearsExperience: 8,
    hasAdverseMedia: false,
    complianceHistory: 'clean'
  },
  {
    id: 'DIR_04',
    name: 'Sipho Ndlovu',
    boardPositions: ['SUP_101', 'SUP_102', 'SUP_103', 'SUP_104'], // 4 boards - MAJOR CONCENTRATION RISK
    yearsExperience: 15,
    hasAdverseMedia: true,  // Media reports on multiple directorships
    complianceHistory: 'minor'
  },
  {
    id: 'DIR_05',
    name: 'Liam O\'Connell',
    boardPositions: ['SUP_105', 'SUP_202'],
    yearsExperience: 22,
    hasAdverseMedia: false,
    complianceHistory: 'clean'
  },
  {
    id: 'DIR_06',
    name: 'Fatima Khan',
    boardPositions: ['SUP_201', 'SUP_202', 'SUP_203'], // 3 boards - SECONDARY CONCENTRATION RISK
    yearsExperience: 10,
    hasAdverseMedia: false,
    complianceHistory: 'clean'
  },
  {
    id: 'DIR_07',
    name: 'Thabo Mthembu',
    boardPositions: ['SUP_301', 'SUP_303'],
    yearsExperience: 14,
    hasAdverseMedia: false,
    complianceHistory: 'clean'
  },
  {
    id: 'DIR_08',
    name: 'Sarah Mitchell',
    boardPositions: ['SUP_302', 'SUP_303'],
    yearsExperience: 16,
    hasAdverseMedia: false,
    complianceHistory: 'clean'
  },
  {
    id: 'DIR_09',
    name: 'Ahmed Hassan',
    boardPositions: ['SUP_401'],
    yearsExperience: 6,
    hasAdverseMedia: false,
    complianceHistory: 'clean'
  },
  {
    id: 'DIR_10',
    name: 'Nomsa Dlamini',
    boardPositions: ['SUP_402'],
    yearsExperience: 9,
    hasAdverseMedia: false,
    complianceHistory: 'clean'
  }
];

// Define supplier profiles with detailed risk factors
const SUPPLIER_PROFILES: SupplierRiskProfile[] = [
  // High Risk Cluster - North West Operations
  {
    id: 'SUP_101',
    name: 'Rustenburg Explosives Inc.',
    baseRiskFactors: {
      operational: 90,  // Explosives - inherently dangerous
      financial: 65,
      compliance: 85,   // Regulatory heavy industry
      reputational: 70,
      contractual: 60
    },
    contractValueZAR: 50000000,
    directorIds: ['DIR_01', 'DIR_04'],
    category: 'Explosives & Chemicals',
    geographicRisk: 'high',
    linkedMineSiteIds: ['MS_01', 'MS_02']
  },
  {
    id: 'SUP_102',
    name: 'Marikana Heavy Machinery Lease',
    baseRiskFactors: {
      operational: 70,
      financial: 80,   // High capital equipment risk
      compliance: 65,
      reputational: 85, // Marikana historical issues
      contractual: 70
    },
    contractValueZAR: 75000000,
    directorIds: ['DIR_02', 'DIR_04'],
    category: 'Heavy Machinery',
    geographicRisk: 'high',
    linkedMineSiteIds: ['MS_01', 'MS_02']
  },
  {
    id: 'SUP_103',
    name: 'Limpopo Logistix',
    baseRiskFactors: {
      operational: 85,  // Highest operational risk in dataset
      financial: 60,
      compliance: 70,
      reputational: 50,
      contractual: 65
    },
    contractValueZAR: 30000000,
    directorIds: ['DIR_04', 'DIR_06'], // Bridge between high and medium risk clusters
    category: 'Logistics & Transportation',
    geographicRisk: 'high',
    linkedMineSiteIds: ['MS_01', 'MS_03']
  },
  {
    id: 'SUP_104',
    name: 'North West Mining Supplies',
    baseRiskFactors: {
      operational: 75,
      financial: 65,
      compliance: 80,
      reputational: 55,
      contractual: 70
    },
    contractValueZAR: 45000000,
    directorIds: ['DIR_01', 'DIR_04'],
    category: 'Mining Supplies',
    geographicRisk: 'high',
    linkedMineSiteIds: ['MS_01', 'MS_02']
  },
  {
    id: 'SUP_105',
    name: 'Platinum Province Chemicals',
    baseRiskFactors: {
      operational: 80,
      financial: 70,
      compliance: 90,   // Chemical industry highly regulated
      reputational: 60,
      contractual: 65
    },
    contractValueZAR: 65000000,
    directorIds: ['DIR_02', 'DIR_05'],
    category: 'Chemicals',
    geographicRisk: 'high',
    linkedMineSiteIds: ['MS_01', 'MS_02']
  },
  
  // Medium Risk Cluster - Gauteng Operations
  {
    id: 'SUP_201',
    name: 'Gauteng Gold Refiners',
    baseRiskFactors: {
      operational: 60,
      financial: 55,
      compliance: 65,
      reputational: 70,  // Unethical sourcing practices reported
      contractual: 50
    },
    contractValueZAR: 120000000, // Highest contract value
    directorIds: ['DIR_03', 'DIR_06'],
    category: 'Gold Refining',
    geographicRisk: 'medium',
    linkedMineSiteIds: ['MS_03', 'MS_04']
  },
  {
    id: 'SUP_202',
    name: 'West Rand Water Purification',
    baseRiskFactors: {
      operational: 45,
      financial: 50,
      compliance: 55,
      reputational: 40,
      contractual: 45
    },
    contractValueZAR: 25000000,
    directorIds: ['DIR_05', 'DIR_06'],
    category: 'Water Treatment',
    geographicRisk: 'medium',
    linkedMineSiteIds: ['MS_03', 'MS_04']
  },
  {
    id: 'SUP_203',
    name: 'Johannesburg Engineering Services',
    baseRiskFactors: {
      operational: 40,
      financial: 45,
      compliance: 50,
      reputational: 35,
      contractual: 40
    },
    contractValueZAR: 85000000,
    directorIds: ['DIR_03', 'DIR_06'],
    category: 'Engineering Services',
    geographicRisk: 'medium',
    linkedMineSiteIds: ['MS_03', 'MS_04']
  },
  
  // Low Risk Cluster - Free State Operations
  {
    id: 'SUP_301',
    name: 'Welkom Safety Gear Pty Ltd',
    baseRiskFactors: {
      operational: 20,
      financial: 25,
      compliance: 30,
      reputational: 15,
      contractual: 20
    },
    contractValueZAR: 15000000,
    directorIds: ['DIR_07'],
    category: 'Safety Equipment',
    geographicRisk: 'low',
    linkedMineSiteIds: ['MS_05']
  },
  {
    id: 'SUP_302',
    name: 'Free State Catering Co.',
    baseRiskFactors: {
      operational: 25,
      financial: 30,
      compliance: 20,
      reputational: 25,
      contractual: 25
    },
    contractValueZAR: 8000000,
    directorIds: ['DIR_08'],
    category: 'Catering Services',
    geographicRisk: 'low',
    linkedMineSiteIds: ['MS_05']
  },
  {
    id: 'SUP_303',
    name: 'Free State Transportation Hub',
    baseRiskFactors: {
      operational: 35,
      financial: 30,
      compliance: 25,
      reputational: 20,
      contractual: 30
    },
    contractValueZAR: 18000000,
    directorIds: ['DIR_07', 'DIR_08'],
    category: 'Transportation',
    geographicRisk: 'low',
    linkedMineSiteIds: ['MS_05']
  },
  
  // Isolated Suppliers
  {
    id: 'SUP_401',
    name: 'Cape Town Tech Solutions',
    baseRiskFactors: {
      operational: 40,
      financial: 35,
      compliance: 30,
      reputational: 25,
      contractual: 35
    },
    contractValueZAR: 22000000,
    directorIds: ['DIR_09'],
    category: 'IT Services',
    geographicRisk: 'medium',
    linkedMineSiteIds: ['MS_06']
  },
  {
    id: 'SUP_402',
    name: 'Independent Security Services',
    baseRiskFactors: {
      operational: 55,
      financial: 45,
      compliance: 60,
      reputational: 40,
      contractual: 50
    },
    contractValueZAR: 38000000,
    directorIds: ['DIR_10'],
    category: 'Security Services',
    geographicRisk: 'medium',
    linkedMineSiteIds: ['MS_06']
  }
];

/**
 * Apply risk scoring and generate updated data
 */
export function applyRiskScoring(): {
  suppliers: Array<{
    id: string;
    name: string;
    riskScore: number;
    riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
    breakdown: any;
  }>;
  directors: Array<{
    id: string;
    name: string;
    riskScore: number;
    riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
    boardCount: number;
    isConcentrationRisk: boolean;
  }>;
  concentrationRisks: any;
  summary: {
    totalSuppliers: number;
    totalDirectors: number;
    highRiskSuppliers: number;
    concentrationRiskDirectors: number;
    avgSupplierRisk: number;
    avgDirectorRisk: number;
  };
} {
  // Initialize risk scoring engine
  const riskEngine = new RiskScoringEngine(
    SUPPLIER_PROFILES,
    DIRECTOR_PROFILES,
    DEFAULT_RISK_CONFIG
  );

  // Calculate all risk scores
  const allRisks = riskEngine.calculateAllRiskScores();
  
  // Process suppliers
  const suppliers = allRisks.suppliers.map(s => {
    const profile = SUPPLIER_PROFILES.find(p => p.id === s.id)!;
    return {
      id: s.id,
      name: profile.name,
      riskScore: s.riskScore,
      riskLevel: RiskScoringEngine.getRiskLevel(s.riskScore),
      breakdown: riskEngine.getSupplierRiskBreakdown(s.id)
    };
  });

  // Process directors
  const directors = allRisks.directors.map(d => {
    const profile = DIRECTOR_PROFILES.find(p => p.id === d.id)!;
    return {
      id: d.id,
      name: profile.name,
      riskScore: d.riskScore,
      riskLevel: RiskScoringEngine.getRiskLevel(d.riskScore),
      boardCount: profile.boardPositions.length,
      isConcentrationRisk: profile.boardPositions.length >= 3
    };
  });

  // Get concentration risks
  const concentrationRisks = riskEngine.getConcentrationRisks();

  // Calculate summary statistics
  const summary = {
    totalSuppliers: suppliers.length,
    totalDirectors: directors.length,
    highRiskSuppliers: suppliers.filter(s => s.riskScore >= 50).length,
    concentrationRiskDirectors: directors.filter(d => d.isConcentrationRisk).length,
    avgSupplierRisk: Math.round(suppliers.reduce((sum, s) => sum + s.riskScore, 0) / suppliers.length),
    avgDirectorRisk: Math.round(directors.reduce((sum, d) => sum + d.riskScore, 0) / directors.length)
  };

  return {
    suppliers,
    directors,
    concentrationRisks,
    summary
  };
}

/**
 * Generate risk scoring report
 */
export function generateRiskReport(): string {
  const results = applyRiskScoring();
  
  let report = `
# EXECUTIVE RISK SCORING REPORT
Generated: ${new Date().toISOString()}

## SUMMARY STATISTICS
- Total Suppliers: ${results.summary.totalSuppliers}
- Total Directors: ${results.summary.totalDirectors}
- High Risk Suppliers (≥50%): ${results.summary.highRiskSuppliers}
- Concentration Risk Directors (≥3 boards): ${results.summary.concentrationRiskDirectors}
- Average Supplier Risk: ${results.summary.avgSupplierRisk}%
- Average Director Risk: ${results.summary.avgDirectorRisk}%

## TOP RISK DIRECTORS (Concentration Risk)
`;

  results.directors
    .filter(d => d.isConcentrationRisk)
    .sort((a, b) => b.riskScore - a.riskScore)
    .forEach(director => {
      report += `\n### ${director.name} (${director.id})
- Risk Score: ${director.riskScore}% (${director.riskLevel})
- Board Positions: ${director.boardCount}
- Concentration Risk: YES
`;
    });

  report += `\n## TOP RISK SUPPLIERS`;
  
  results.suppliers
    .sort((a, b) => b.riskScore - a.riskScore)
    .slice(0, 10)
    .forEach(supplier => {
      report += `\n### ${supplier.name} (${supplier.id})
- Risk Score: ${supplier.riskScore}% (${supplier.riskLevel})
- Base Risk: ${supplier.breakdown.baseRisk}%
- Concentration Penalty: +${supplier.breakdown.concentrationPenalty}
- Network Multiplier: ${supplier.breakdown.networkMultiplier}x
- Geographic Multiplier: ${supplier.breakdown.geographicMultiplier}x
`;
    });

  return report;
}

export default applyRiskScoring;